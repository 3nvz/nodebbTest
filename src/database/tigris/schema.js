'use strict';

const jsonSchema = `{"_key":"string","nextEid":"integer","nextCid":"integer","nextUid":"integer","userCount":"integer","nextTid":"integer","topicCount":"integer","nextPid":"integer","postCount":"integer","uniqueIPCount":"integer","loginCount":"number","nextTopicEventId":"integer","nextChatRoomId":"integer","nextMid":"integer","rewards:id":"integer","nextNsEmbedRule":"integer","nextFlagId":"integer","value":"string","score":"number","eid":"integer","ip":"string","text":"string","timestamp":"number","type":"string","uid":"integer","createtime":"number","description":"string","disableJoinRequests":"integer","disableLeave":"integer","hidden":"integer","memberCount":"integer","name":"string","private":"integer","slug":"string","system":"integer","userTitle":"string","userTitleEnabled":"integer","bgColor":"string","cid":"integer","class":"string","color":"string","descriptionParsed":"string","disabled":"integer","icon":"string","imageClass":"string","isSection":"integer","link":"string","numRecentReplies":"integer","order":"integer","parentCid":"number","post_count":"integer","subCategoriesPerPage":"integer","topic_count":"integer","backgroundImage":"string","labelColor":"string","memberPostCids":"string","textColor":"string","members":"array","newTitle":"string","oldTitle":"string","tid":"string","header":"string","sidebar":"string","footer":"string","motd":"string","disableMasonry":"integer","version":"string","postsIndexed":"integer","topicsIndexed":"integer","working":"integer","apiKey":"string","domain":"string","eu":"string","hash":"string","disableEmailSubscriptions":"integer","disableEmailSubscriptions_old":"integer","email:smtpTransport:enabled":"integer","email:smtpTransport:enabled_old":"integer","email:smtpTransport:pool":"integer","email:smtpTransport:pool_old":"integer","backgroundColor":"string","brand:favicon":"string","brand:logo":"string","brand:logo:alt":"string","brand:logo:url":"string","brand:maskableIcon":"string","brand:touchIcon":"string","browserTitle":"string","keywords":"string","og:image":"string","outgoingLinks:whitelist":"string","themeColor":"string","title":"string","title:short":"string","title:url":"string","titleLayout":"string","title_old":"string","useOutgoingLinksPage":"integer","stopforumspamEnabled":"string","composeRouteEnabled":"string","customCSS":"string","customCSS_old":"string","disableMasonry_old":"integer","disableStagger":"integer","customHTML":"string","customHTML_old":"string","useCustomHTML":"integer","useCustomHTML_old":"integer","categoryTopicSort":"string","composer:customHelpText":"string","groupsExemptFromPostQueue":"string","groupsExemptFromPostQueue_old":"array","postEditDuration":"number","postEditDuration_old":"number","signatures:disableImages":"integer","signatures:disableLinks":"integer","topicPostSort":"string","trackIpPerPost":"integer","disableSignatures":"integer","disableSignatures_old":"integer","minimumPostLength":"integer","minimumPostLength_old":"integer","signatures:disableImages_old":"integer","signatures:disableLinks_old":"integer","allowUserHomePage":"integer","allowUserHomePage_old":"integer","homePageCustom":"string","homePageRoute":"string","homePageTitle":"string","access-control-allow-credentials":"string","access-control-allow-headers":"string","access-control-allow-methods":"string","access-control-allow-origin":"string","access-control-allow-origin-regex":"string","analytics:maxCache":"integer","csp-frame-ancestors":"string","hsts-enabled":"integer","hsts-enabled_old":"integer","hsts-preload":"integer","hsts-preload_old":"integer","hsts-subdomains":"integer","hsts-subdomains_old":"integer","maintenanceModeMessage":"string","powered-by":"string","brand:favicon_old":"string","brand:maskableIcon_old":"string","brand:touchIcon_old":"string","outgoingLinks:whitelist_old":"string","adminReloginDuration":"integer","adminReloginDuration_old":"integer","allowAccountDelete":"integer","allowAccountDelete_old":"integer","allowLoginWith":"string","disableCustomUserSkins":"integer","followTopicsOnCreate":"integer","followTopicsOnReply":"integer","openOutgoingLinksInNewTab":"integer","password:disableEdit":"integer","restrictChat":"integer","showemail":"integer","showfullname":"integer","termsOfUse":"string","topicSearchEnabled":"integer","autoApproveTime":"integer","autoApproveTime_old":"integer","categoryWatchState":"string","categoryWatchState_old":"string","followTopicsOnCreate_old":"integer","followTopicsOnReply_old":"integer","maximumUsernameLength":"integer","maximumUsernameLength_old":"integer","minimumPasswordLength":"integer","minimumPasswordLength_old":"integer","minimumPasswordStrength":"integer","minimumPasswordStrength_old":"integer","minimumUsernameLength":"integer","minimumUsernameLength_old":"integer","registrationApprovalType":"string","registrationApprovalType_old":"string","registrationType":"string","registrationType_old":"string","showAverageApprovalTime":"integer","showAverageApprovalTime_old":"integer","downvotesPerUserPerDay":"integer","downvotesPerUserPerDay_old":"integer","flags:autoResolveOnBan":"integer","flags:limitPerTarget":"integer","flags:limitPerTarget_old":"integer","min:rep:aboutme":"number","min:rep:aboutme_old":"number","min:rep:downvote":"integer","min:rep:downvote_old":"integer","min:rep:profile-picture":"number","min:rep:profile-picture_old":"number","min:rep:signature":"number","min:rep:signature_old":"number","min:rep:website":"number","min:rep:website_old":"number","allowGuestReplyNotifications":"integer","allowGuestReplyNotifications_old":"integer","systemTags":"string","systemTags_old":"string","newbiePostEditDuration":"integer","newbiePostEditDuration_old":"integer","preventTopicDeleteAfterReplies":"integer","preventTopicDeleteAfterReplies_old":"integer","unreadCutoff":"integer","unreadCutoff_old":"integer","allowProfileImageUploads":"integer","allowProfileImageUploads_old":"integer","allowedFileExtensions":"string","allowedFileExtensions_old":"string","defaultAvatar":"string","privateUploadsExtensions":"string","profile:defaultCovers":"string","defaultLang":"string","defaultLang_old":"string","disableChatMessageEditing":"integer","maximumUsersInChatRoom":"integer","maximumUsersInChatRoom_old":"integer","token":"string","requireHttps":"string","defaultAvatar_old":"string","profile:convertProfileImageToPNG":"integer","profile:convertProfileImageToPNG_old":"integer","pid":"integer","groupName":"string","targetUid":"number","action":"string","privilege":"string","target":"string","enableQuickReply":"string","hideCategoryLastPost":"string","hideSubCategories":"string","brand:logo_old":"string","access-control-allow-origin_old":"string","csp-frame-ancestors_old":"string","homePageTitle_old":"string","adminRevalidate":"string","allowBannedUsers":"string","behaviour":"string","cookieDomain":"string","cookieName":"string","editOverride":"string","guestRedirect":"string","hostWhitelist":"string","loginOverride":"string","logoutRedirect":"string","noRegistration":"string","payload:aboutme":"string","payload:birthday":"string","payload:email":"string","payload:firstName":"string","payload:fullname":"string","payload:groupTitle":"string","payload:id":"string","payload:lastName":"string","payload:location":"string","payload:picture":"string","payload:signature":"string","payload:username":"string","payload:website":"string","payloadParent":"string","registerOverride":"string","reverseToken":"string","secret":"string","syncGroupJoin":"string","syncGroupLeave":"string","syncGroupList":"string","syncGroups":"string","updateProfile":"string","email":"string","gdpr_consent":"integer","joindate":"number","lastonline":"number","status":"string","username":"string","userslug":"string","password":"string","password:shaWrapped":"integer","email:confirmed":"integer","profileviews":"integer","fullname":"string","picture":"string","rss_token":"string","displayname":"string","followingCount":"integer","postcount":"integer","lastposttime":"number","cover:url":"string","topiccount":"integer","reputation":"integer","groupTitle":"string","followerCount":"integer","location":"string","aboutme":"string","renewal":"string","subrenewal":"string","plantype":"string","credits":"string","calculators":"string","rawsamples":"string","route":"string","samples":"string","cover:position":"string","flags":"integer","confirm_code":"string","subject":"string","template":"string","data":"string","b57120d1-0650-49b3-ac72-ee841b3b6cfd":"integer","mainPid":"string","viewcount":"integer","postercount":"integer","pinned":"integer","downvotes":"integer","upvotes":"integer","headerImage":"string","summary":"string","tags":"string","oldCid":"integer","content":"string","edited":"number","editor":"integer","replies":"integer","patch":"string","array":"array","email:custom:partials/header":"string","email:from_name":"string","email:from_name_old":"string","includeUnverifiedEmails":"integer","includeUnverifiedEmails_old":"integer","email:custom:notification":"string","useOutgoingLinksPage_old":"integer","useCustomCSS":"integer","useCustomCSS_old":"integer","enableLiveReload":"integer","enableLiveReload_old":"integer","postQueue":"integer","postQueue_old":"integer","postDeleteDuration":"integer","postDeleteDuration_old":"integer","blacklist":"string","cacheMaxAgeDays":"string","camoProxyHost":"string","camoProxyKey":"string","doNoteParseIfVotesLessThen":"string","endpoint":"string","allowRTLO":"string","breaks":"string","checkboxes":"string","defaultHighlightLanguage":"string","externalBlank":"string","highlight":"string","highlightLinesLanguageList":"string","highlightTheme":"string","html":"string","langPrefix":"string","linkify":"string","multimdTables":"string","nofollow":"string","probe":"string","probeCacheSize":"string","typographer":"string","xhtmlOut":"string","newbiePostDelayThreshold":"integer","newbiePostDelayThreshold_old":"integer","advancedShown":"string","allowedAttributes":"string","allowedIframeHostnames":"string","allowedTags":"string","parseAgain":"string","selfClosing":"string","left":"string","right":"string","allowLoginWith_old":"string","email:disableEdit":"integer","email:disableEdit_old":"integer","password:disableEdit_old":"integer","username:disableEdit":"integer","username:disableEdit_old":"integer","min:rep:flag":"integer","min:rep:flag_old":"integer","banned:expire":"integer","defaultCid_1":"string","defaultCid_2":"string","defaultCid_3":"string","defaultCid_4":"string","defaultCid_44":"string","defaultCid_45":"string","defaultCid_46":"string","defaultCid_47":"string","defaultCid_48":"string","defaultCid_49":"string","defaultCid_5":"string","defaultCid_50":"string","defaultCid_6":"string","defaultCid_7":"string","defaultCid_8":"string","defaultCid_9":"string","forceQuestions":"string","toggleLock":"string","defaultCid_52":"string","defaultCid_53":"string","defaultCid_54":"string","defaultCid_55":"string","defaultCid_56":"string","defaultCid_57":"string","defaultCid_58":"string","defaultCid_59":"string","defaultCid_60":"string","defaultCid_61":"string","defaultCid_62":"string","defaultCid_84":"string","defaultCid_85":"string","defaultCid_86":"string","defaultCid_87":"string","defaultCid_88":"string","defaultCid_89":"string","defaultCid_90":"string","defaultCid_91":"string","defaultCid_92":"string","defaultCid_93":"string","defaultCid_94":"string","defaultCid_95":"string","defaultCid_96":"string","defaultCid_100":"string","defaultCid_101":"string","defaultCid_102":"string","defaultCid_97":"string","defaultCid_98":"string","defaultCid_99":"string","acpLang":"string","dailyDigestFreq":"string","notificationType_follow":"string","notificationType_group-invite":"string","notificationType_group-leave":"string","notificationType_group-request-membership":"string","notificationType_mention":"string","notificationType_new-chat":"string","notificationType_new-group-chat":"string","notificationType_new-reply":"string","notificationType_new-topic":"string","notificationType_post-edit":"string","notificationType_upvote":"string","postsPerPage":"integer","scrollToMyPost":"integer","topicsPerPage":"integer","updateUrlWithPostIndex":"integer","upvoteNotifFreq":"string","usePagination":"integer","userLang":"string","notificationType_new-post-flag":"string","notificationType_post-queue":"string","owner":"integer","roomId":"integer","groupChat":"integer","deleted":"integer","fromuid":"integer","ownOnly":"string","_":"string","v":"string","leftsidebar":"string","contenttop":"string","contentbottom":"string","contentbetween":"string","restrictChat_old":"integer","gdpr_enabled":"integer","gdpr_enabled_old":"integer","updateUrlWithPostIndex_old":"integer","notificationType_new-register":"string","notificationType_new-user-flag":"string","notificationType_test":"string","quillDelta":"string","censorWholeWord":"string","id":"string","illegal":"string","urls":"string","news":"string","created":"number","topics":"integer","customAvatar":"string","generateOnRefreash":"string","override":"string","cids":"string","noStrictSSL":"string","loginDays":"integer","loginDays_old":"integer","onlineCutoff":"integer","onlineCutoff_old":"integer","composer:showHelpTab":"integer","composer:showHelpTab_old":"integer","enablePostHistory":"integer","enablePostHistory_old":"integer","postQueueReputationThreshold":"integer","postQueueReputationThreshold_old":"integer","teaserPost":"string","teaserPost_old":"string","force":"integer","email:from":"string","email:from_old":"string","claimable":"string","condition":"string","conditional":"string","rid":"string","email:custom:notification_old":"string","votesArePublic":"integer","votesArePublic_old":"integer","composer:allowPluginHelp":"integer","composer:allowPluginHelp_old":"integer","expire":"number","fromUid":"integer","reason":"string","access-control-allow-origin-regex_old":"string","cross-origin-resource-policy":"string","cross-origin-resource-policy_old":"string","access-control-allow-headers_old":"string","access-control-allow-methods_old":"string","powered-by_old":"string","require_consent":"string","hideEmail":"integer","hideEmail_old":"integer","preserveOrphanedUploads":"integer","profile:defaultCovers_old":"string","fromCid":"integer","toCid":"string","catUpdated":"boolean","tested":"boolean","email:custom:banned":"string","email:custom:banned_old":"string","newContent":"string","oldContent":"string","sendValidationEmail":"integer","sendValidationEmail_old":"integer","locked":"integer","cross-origin-embedder-policy":"integer","cross-origin-embedder-policy_old":"integer","blog":"string","groupTitleArray":"array","bookmarkThreshold":"integer","bookmarkThreshold_old":"integer","blog-comments:cid":"string","blog-comments:compose-location":"string","blog-comments:name":"string","blog-comments:url":"string","isQuestion":"integer","isSolved":"integer","teaserPid":"integer","blog-comments:url_old":"string","R2Vub3Bsb3QvMTdkNThlMDEwMmE=":"integer","blog-comments:compose-location_old":"string","displayName":"string","regex":"string","replacement":"string","maximumRelatedTopics":"integer","maximumRelatedTopics_old":"integer","toPid":"string","solvedPid":"string","notificationType_new-chat_old":"string","uploadRateLimitThreshold":"integer","uploadRateLimitThreshold_old":"integer","dropdownContent":"string","enabled":"string","groups":"string","iconClass":"string","textClass":"string","originalUid":"integer","href":"string","topicPostSort_old":"string","blocksCount":"integer","latestPost":"string","flagId":"integer","datetime":"number","targetId":"integer","state":"string","flags:autoFlagOnDownvoteThreshold":"integer","flags:autoFlagOnDownvoteThreshold_old":"integer","customJS":"string","customJS_old":"string","useCustomJS":"integer","useCustomJS_old":"integer","deleterUid":"integer","deletedTimestamp":"number","tiled":"boolean","maxTags":"string","maximumPostLength":"number","maximumPostLength_old":"number","image":"string","identifier":"string","genoOwner":"string","title:short_old":"string","browserTitle_old":"string","keywords_old":"string","topicStaleDays":"integer","topicStaleDays_old":"integer","resizeImageWidth":"integer","resizeImageWidth_old":"integer","trackIpPerPost_old":"integer","notificationType_mention_old":"string","notificationType_new-group-chat_old":"string","notificationType_upvote_old":"string","email:smtpTransport:service":"string","email:smtpTransport:service_old":"string","email:smtpTransport:pass":"string","email:smtpTransport:pass_old":"string","email:smtpTransport:user":"string","email:smtpTransport:user_old":"string","notificationSendDelay":"integer","notificationSendDelay_old":"integer","bodyLong":"string","bodyShort":"string","from":"integer","importance":"integer","nid":"string","path":"string","topicTitle":"string","genoUser":"string","downvotesPerDay":"integer","downvotesPerDay_old":"integer","upvotesPerUserPerDay":"integer","upvotesPerUserPerDay_old":"integer","upvotesPerDay":"integer","upvotesPerDay_old":"integer","moderation":"array","mergeId":"string","maxTopicsPerPage":"integer","maxTopicsPerPage_old":"integer","topicsPerPage_old":"integer","maximumTagLength":"integer","maximumTagLength_old":"integer","minimumTagLength":"integer","minimumTagLength_old":"integer","usePagination_old":"integer","categoryTopicSort_old":"string","batch_size":"string","host":"string","index_name":"string","post_type":"string","healthCheckInterval":"string","indexed":"boolean","maxDocuments":"string","typoTolerance":"string","typoToleranceMinWordSizeOneTypo":"string","typoToleranceMinWordSizeTwoTypos":"string","feedback":"string","notification":"string","delete":"string","tos":"string","context":"string","bypassOnReputation":"string","debug":"string","reply":"string","enableCarousel":"string","enableCarouselPagination":"string","maxSlides":"string","useCompression":"integer","useCompression_old":"integer","rule":"string","uploadedpicture":"string","birthday":"string","website":"string"}`;

const mapper = JSON.parse(jsonSchema);

function getSchemas() {
	const helpers = require('./helpers');
	const schemaObject = {
		title: 'objects',
		additionalProperties: true,
		type: 'object',
		primary_key: [
			'_id',
		],
		properties: {
			_id: {
				type: 'string',
				format: 'byte',
				autoGenerate: true,
			},
			$k: {
				type: 'array',
				items: {
					type: 'string',
				},
			},
			_key: {
				type: 'string',
				searchIndex: true,
				index: true,
			},
		},
	};
	Object.entries(mapper).forEach(([key, value]) => {
		if (key === '_key') {
			return;
		}
		schemaObject.properties[helpers.fieldToString(key)] = getType(value);
	});

	return schemaObject;
}

function getType(type) {
	const response = {
		type,
	};
	if (type === 'integer') {
		response.format = 'int32';
	}
	if (type === 'array') {
		response.items = {
			type: 'string',
		};
	}
	return response;
}


module.exports = {
	schemaObject: getSchemas(),
	mapper,
};
