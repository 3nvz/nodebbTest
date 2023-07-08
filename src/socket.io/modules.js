'use strict';

const _ = require('lodash');

const db = require('../database');
const Messaging = require('../messaging');
const utils = require('../utils');
const user = require('../user');
const groups = require('../groups');
const privileges = require('../privileges');

const SocketModules = module.exports;

SocketModules.chats = {};
SocketModules.settings = {};

/* Chat */

SocketModules.chats.getRaw = async function (socket, data) {
	if (!data || !data.hasOwnProperty('mid')) {
		throw new Error('[[error:invalid-data]]');
	}
	const roomId = await Messaging.getMessageField(data.mid, 'roomId');
	const [isAdmin, canViewMessage, inRoom] = await Promise.all([
		user.isAdministrator(socket.uid),
		Messaging.canViewMessage(data.mid, roomId, socket.uid),
		Messaging.isUserInRoom(socket.uid, roomId),
	]);

	if (!isAdmin && (!inRoom || !canViewMessage)) {
		throw new Error('[[error:not-allowed]]');
	}

	return await Messaging.getMessageField(data.mid, 'content');
};

SocketModules.chats.isDnD = async function (socket, uid) {
	const status = await db.getObjectField(`user:${uid}`, 'status');
	return status === 'dnd';
};

SocketModules.chats.canMessage = async function (socket, roomId) {
	await Messaging.canMessageRoom(socket.uid, roomId);
};

SocketModules.chats.markAllRead = async function (socket) {
	// no v3 method ?
	await Messaging.markAllRead(socket.uid);
	Messaging.pushUnreadCount(socket.uid);
};

SocketModules.chats.getRecentChats = async function (socket, data) {
	if (!data || !utils.isNumber(data.after) || !utils.isNumber(data.uid)) {
		throw new Error('[[error:invalid-data]]');
	}
	const start = parseInt(data.after, 10);
	const stop = start + 9;
	return await Messaging.getRecentChats(socket.uid, data.uid, start, stop);
};

SocketModules.chats.hasPrivateChat = async function (socket, uid) {
	if (socket.uid <= 0 || uid <= 0) {
		throw new Error('[[error:invalid-data]]');
	}
	return await Messaging.hasPrivateChat(socket.uid, uid);
};

SocketModules.chats.getIP = async function (socket, mid) {
	const allowed = await privileges.global.can('view:users:info', socket.uid);
	if (!allowed) {
		throw new Error('[[error:no-privilege]]');
	}
	return await Messaging.getMessageField(mid, 'ip');
};

SocketModules.chats.getUnreadCount = async function (socket) {
	return await Messaging.getUnreadCount(socket.uid);
};

SocketModules.chats.enter = async function (socket, roomIds) {
	await joinLeave(socket, roomIds, 'join');
};

SocketModules.chats.leave = async function (socket, roomIds) {
	await joinLeave(socket, roomIds, 'leave');
};

SocketModules.chats.enterPublic = async function (socket, roomIds) {
	await joinLeave(socket, roomIds, 'join', 'chat_room_public');
};

SocketModules.chats.leavePublic = async function (socket, roomIds) {
	await joinLeave(socket, roomIds, 'leave', 'chat_room_public');
};

async function joinLeave(socket, roomIds, method, prefix = 'chat_room') {
	if (!(socket.uid > 0)) {
		throw new Error('[[error:not-allowed]]');
	}
	if (!Array.isArray(roomIds)) {
		roomIds = [roomIds];
	}
	if (roomIds.length) {
		const [isAdmin, inRooms, roomData] = await Promise.all([
			user.isAdministrator(socket.uid),
			Messaging.isUserInRoom(socket.uid, roomIds),
			Messaging.getRoomsData(roomIds, ['public', 'groups']),
		]);

		await Promise.all(roomIds.map(async (roomId, idx) => {
			const isPublic = roomData[idx] && roomData[idx].public;
			const groups = roomData[idx] && roomData[idx].groups;
			if (isAdmin || (inRooms[idx] && (!isPublic || await groups.isMemberOfAny(socket.uid, groups)))) {
				socket[method](`${prefix}_${roomId}`);
			}
		}));
	}
}

SocketModules.chats.sortPublicRooms = async function (socket, data) {
	if (!data || !Array.isArray(data.scores) || !Array.isArray(data.roomIds)) {
		throw new Error('[[error:invalid-data]]');
	}
	const isAdmin = await user.isAdministrator(socket.uid);
	if (!isAdmin) {
		throw new Error('[[error:no-privileges]]');
	}
	await db.sortedSetAdd(`chat:rooms:public:order`, data.scores, data.roomIds);
};

SocketModules.chats.searchMembers = async function (socket, data) {
	if (!data || !data.roomId) {
		throw new Error('[[error:invalid-data]]');
	}
	const [isAdmin, inRoom, isRoomOwner] = await Promise.all([
		user.isAdministrator(socket.uid),
		Messaging.isUserInRoom(socket.uid, data.roomId),
		Messaging.isRoomOwner(socket.uid, data.roomId),
	]);

	if (!isAdmin && !inRoom) {
		throw new Error('[[error:no-privileges]]');
	}

	const results = await user.search({
		query: data.username,
		paginate: false,
		hardCap: -1,
	});

	const { users } = results;
	const foundUids = users.map(user => user && user.uid);
	const isUidInRoom = _.zipObject(
		foundUids,
		await Messaging.isUsersInRoom(foundUids, data.roomId)
	);

	const roomUsers = users.filter(user => isUidInRoom[user.uid]);
	const isOwners = await Messaging.isRoomOwner(roomUsers.map(u => u.uid), data.roomId);

	roomUsers.forEach((user, index) => {
		if (user) {
			user.isOwner = isOwners[index];
			user.canKick = isRoomOwner && (parseInt(user.uid, 10) !== parseInt(socket.uid, 10));
		}
	});

	roomUsers.sort((a, b) => {
		if (a.isOwner && !b.isOwner) {
			return -1;
		} else if (!a.isOwner && b.isOwner) {
			return 1;
		}
		return 0;
	});
	return { users: roomUsers };
};

require('../promisify')(SocketModules);
