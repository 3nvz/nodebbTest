
'use strict';

var async = require('async');
var _ = require('lodash');
var validator = require('validator');

var db = require('../database');
var user = require('../user');
var posts = require('../posts');
var meta = require('../meta');
var plugins = require('../plugins');
var utils = require('../../public/src/utils');

module.exports = function (Topics) {
	Topics.onNewPostMade = function (postData, callback) {
		async.series([
			function (next) {
				Topics.updateLastPostTime(postData.tid, postData.timestamp, next);
			},
			function (next) {
				Topics.addPostToTopic(postData.tid, postData, next);
			},
		], callback);
	};

	Topics.getTopicPosts = function (tid, set, start, stop, uid, reverse, callback) {
		async.waterfall([
			function (next) {
				posts.getPostsFromSet(set, start, stop, uid, reverse, next);
			},
			function (posts, next) {
				Topics.calculatePostIndices(posts, start);

				Topics.addPostData(posts, uid, next);
			},
		], callback);
	};

	Topics.addPostData = function (postData, uid, callback) {
		if (!Array.isArray(postData) || !postData.length) {
			return callback(null, []);
		}
		var pids = postData.map(post => post && post.pid);

		if (!Array.isArray(pids) || !pids.length) {
			return callback(null, []);
		}

		function getPostUserData(field, method, callback) {
			var uidsMap = {};

			postData.forEach((post) => {
				if (post && parseInt(post[field], 10) >= 0) {
					uidsMap[post[field]] = 1;
				}
			});
			const uids = Object.keys(uidsMap);

			async.waterfall([
				function (next) {
					method(uids, next);
				},
				function (users, next) {
					next(null, _.zipObject(uids, users));
				},
			], callback);
		}

		async.waterfall([
			function (next) {
				async.parallel({
					bookmarks: function (next) {
						posts.hasBookmarked(pids, uid, next);
					},
					voteData: function (next) {
						posts.getVoteStatusByPostIDs(pids, uid, next);
					},
					userData: function (next) {
						getPostUserData('uid', function (uids, next) {
							posts.getUserInfoForPosts(uids, uid, next);
						}, next);
					},
					editors: function (next) {
						getPostUserData('editor', function (uids, next) {
							user.getUsersFields(uids, ['uid', 'username', 'userslug'], next);
						}, next);
					},
					parents: function (next) {
						Topics.addParentPosts(postData, next);
					},
					replies: function (next) {
						getPostReplies(pids, uid, next);
					},
				}, next);
			},
			function (results, next) {
				postData.forEach(function (postObj, i) {
					if (postObj) {
						postObj.user = postObj.uid ? results.userData[postObj.uid] : _.clone(results.userData[postObj.uid]);
						postObj.editor = postObj.editor ? results.editors[postObj.editor] : null;
						postObj.bookmarked = results.bookmarks[i];
						postObj.upvoted = results.voteData.upvotes[i];
						postObj.downvoted = results.voteData.downvotes[i];
						postObj.votes = postObj.votes || 0;
						postObj.replies = results.replies[i];
						postObj.selfPost = parseInt(uid, 10) > 0 && parseInt(uid, 10) === postObj.uid;

						// Username override for guests, if enabled
						if (meta.config.allowGuestHandles && postObj.uid === 0 && postObj.handle) {
							postObj.user.username = validator.escape(String(postObj.handle));
						}
					}
				});
				plugins.fireHook('filter:topics.addPostData', {
					posts: postData,
					uid: uid,
				}, next);
			},
			function (data, next) {
				next(null, data.posts);
			},
		], callback);
	};

	Topics.modifyPostsByPrivilege = function (topicData, topicPrivileges) {
		var loggedIn = parseInt(topicPrivileges.uid, 10) > 0;
		topicData.posts.forEach(function (post) {
			if (post) {
				post.display_edit_tools = topicPrivileges.isAdminOrMod || (post.selfPost && topicPrivileges['posts:edit']);
				post.display_delete_tools = topicPrivileges.isAdminOrMod || (post.selfPost && topicPrivileges['posts:delete']);
				post.display_moderator_tools = post.display_edit_tools || post.display_delete_tools;
				post.display_move_tools = topicPrivileges.isAdminOrMod && post.index !== 0;
				post.display_post_menu = topicPrivileges.isAdminOrMod ||
					(post.selfPost && !topicData.locked && !post.deleted) ||
					(post.selfPost && post.deleted && parseInt(post.deleterUid, 10) === parseInt(topicPrivileges.uid, 10)) ||
					((loggedIn || topicData.postSharing.length) && !post.deleted);
				post.ip = topicPrivileges.isAdminOrMod ? post.ip : undefined;

				posts.modifyPostByPrivilege(post, topicPrivileges);
			}
		});
	};

	Topics.addParentPosts = async function (postData) {
		var parentPids = postData.map(function (postObj) {
			return postObj && postObj.hasOwnProperty('toPid') ? parseInt(postObj.toPid, 10) : null;
		}).filter(Boolean);

		if (!parentPids.length) {
			return;
		}
		parentPids = _.uniq(parentPids);
		const parentPosts = await posts.async.getPostsFields(parentPids, ['uid']);
		const parentUids = _.uniq(parentPosts.map(postObj => postObj && postObj.uid));
		const userData = await user.async.getUsersFields(parentUids, ['username']);

		var usersMap = {};
		userData.forEach(function (user) {
			usersMap[user.uid] = user.username;
		});
		var parents = {};
		parentPosts.forEach(function (post, i) {
			parents[parentPids[i]] = { username: usersMap[post.uid] };
		});

		postData.forEach(function (post) {
			post.parent = parents[post.toPid];
		});
	};

	Topics.calculatePostIndices = function (posts, start) {
		posts.forEach(function (post, index) {
			if (post) {
				post.index = start + index + 1;
			}
		});
	};

	Topics.getLatestUndeletedPid = async function (tid) {
		const pid = await Topics.getLatestUndeletedReply(tid);
		if (pid) {
			return pid;
		}
		const mainPid = await Topics.getTopicField(tid, 'mainPid');
		const mainPost = await posts.async.getPostFields(mainPid, ['pid', 'deleted']);
		return mainPost.pid && !mainPost.deleted ? mainPost.pid : null;
	};

	Topics.getLatestUndeletedReply = async function (tid) {
		var isDeleted = false;
		var index = 0;
		do {
			/* eslint-disable no-await-in-loop */
			const pids = await db.getSortedSetRevRange('tid:' + tid + ':posts', index, index);
			if (!pids.length) {
				return null;
			}
			isDeleted = await posts.async.getPostField(pids[0], 'deleted');
			if (!isDeleted) {
				return parseInt(pids[0], 10);
			}
			index += 1;
			/* eslint-enable no-await-in-loop */
		} while (isDeleted);
	};

	Topics.addPostToTopic = async function (tid, postData) {
		const mainPid = await Topics.getTopicField(tid, 'mainPid');
		if (!parseInt(mainPid, 10)) {
			await Topics.setTopicField(tid, 'mainPid', postData.pid);
		} else {
			const upvotes = parseInt(postData.upvotes, 10) || 0;
			const downvotes = parseInt(postData.downvotes, 10) || 0;
			const votes = upvotes - downvotes;
			await db.sortedSetsAdd([
				'tid:' + tid + ':posts', 'tid:' + tid + ':posts:votes',
			], [postData.timestamp, votes], postData.pid);
		}
		await Topics.increasePostCount(tid);
		await db.sortedSetIncrBy('tid:' + tid + ':posters', 1, postData.uid);
		await Topics.updateTeaser(tid);
	};

	Topics.removePostFromTopic = async function (tid, postData) {
		await db.sortedSetsRemove([
			'tid:' + tid + ':posts',
			'tid:' + tid + ':posts:votes',
		], postData.pid);
		await Topics.decreasePostCount(tid);
		await db.sortedSetIncrBy('tid:' + tid + ':posters', -1, postData.uid);
		await Topics.updateTeaser(tid);
	};

	Topics.getPids = async function (tid) {
		var [mainPid, pids] = await Promise.all([
			Topics.getTopicField(tid, 'mainPid'),
			db.getSortedSetRange('tid:' + tid + ':posts', 0, -1),
		]);
		if (parseInt(mainPid, 10)) {
			pids = [mainPid].concat(pids);
		}
		return pids;
	};

	Topics.increasePostCount = async function (tid) {
		incrementFieldAndUpdateSortedSet(tid, 'postcount', 1, 'topics:posts');
	};

	Topics.decreasePostCount = async function (tid) {
		incrementFieldAndUpdateSortedSet(tid, 'postcount', -1, 'topics:posts');
	};

	Topics.increaseViewCount = async function (tid) {
		incrementFieldAndUpdateSortedSet(tid, 'viewcount', 1, 'topics:views');
	};

	async function incrementFieldAndUpdateSortedSet(tid, field, by, set) {
		const value = await db.incrObjectFieldBy('topic:' + tid, field, by);
		await db.sortedSetAdd(set, value, tid);
	}

	Topics.getTitleByPid = function (pid, callback) {
		Topics.getTopicFieldByPid('title', pid, callback);
	};

	Topics.getTopicFieldByPid = function (field, pid, callback) {
		async.waterfall([
			function (next) {
				posts.getPostField(pid, 'tid', next);
			},
			function (tid, next) {
				Topics.getTopicField(tid, field, next);
			},
		], callback);
	};

	Topics.getTopicDataByPid = async function (pid) {
		const tid = await posts.async.getPostField(pid, 'tid');
		return await Topics.getTopicData(tid);
	};

	Topics.getPostCount = async function (tid) {
		return await db.getObjectField('topic:' + tid, 'postcount');
	};

	function getPostReplies(pids, callerUid, callback) {
		var arrayOfReplyPids;
		var replyData;
		var uniqueUids;
		var uniquePids;
		async.waterfall([
			function (next) {
				const keys = pids.map(pid => 'pid:' + pid + ':replies');
				db.getSortedSetsMembers(keys, next);
			},
			function (arrayOfPids, next) {
				arrayOfReplyPids = arrayOfPids;

				uniquePids = _.uniq(_.flatten(arrayOfPids));

				posts.getPostsFields(uniquePids, ['pid', 'uid', 'timestamp'], next);
			},
			function (_replyData, next) {
				replyData = _replyData;
				const uids = replyData.map(replyData => replyData && replyData.uid);

				uniqueUids = _.uniq(uids);

				user.getUsersWithFields(uniqueUids, ['uid', 'username', 'userslug', 'picture'], callerUid, next);
			},
			function (userData, next) {
				var uidMap = _.zipObject(uniqueUids, userData);
				var pidMap = _.zipObject(uniquePids, replyData);

				var returnData = arrayOfReplyPids.map(function (replyPids) {
					var uidsUsed = {};
					var currentData = {
						hasMore: false,
						users: [],
						text: replyPids.length > 1 ? '[[topic:replies_to_this_post, ' + replyPids.length + ']]' : '[[topic:one_reply_to_this_post]]',
						count: replyPids.length,
						timestampISO: replyPids.length ? utils.toISOString(pidMap[replyPids[0]].timestamp) : undefined,
					};

					replyPids.sort(function (a, b) {
						return parseInt(a, 10) - parseInt(b, 10);
					});

					replyPids.forEach(function (replyPid) {
						var replyData = pidMap[replyPid];
						if (!uidsUsed[replyData.uid] && currentData.users.length < 6) {
							currentData.users.push(uidMap[replyData.uid]);
							uidsUsed[replyData.uid] = true;
						}
					});

					if (currentData.users.length > 5) {
						currentData.users.pop();
						currentData.hasMore = true;
					}

					return currentData;
				});

				next(null, returnData);
			},
		], callback);
	}
};
