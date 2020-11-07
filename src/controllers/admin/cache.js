'use strict';

const cacheController = module.exports;

const utils = require('../../utils');

cacheController.get = function (req, res) {
	const postCache = require('../../posts/cache');
	const groupCache = require('../../groups').cache;
	const objectCache = require('../../database').objectCache;
	const localCache = require('../../cache');

	let percentFull = 0;
	if (postCache.itemCount > 0) {
		percentFull = ((postCache.length / postCache.max) * 100).toFixed(2);
	}

	const data = {
		postCache: {
			length: postCache.length,
			max: postCache.max,
			itemCount: postCache.itemCount,
			percentFull: percentFull,
			hits: utils.addCommas(String(postCache.hits)),
			misses: utils.addCommas(String(postCache.misses)),
			hitRatio: ((postCache.hits / (postCache.hits + postCache.misses) || 0)).toFixed(4),
			enabled: postCache.enabled,
		},
		groupCache: {
			length: groupCache.length,
			max: groupCache.max,
			itemCount: groupCache.itemCount,
			percentFull: ((groupCache.length / groupCache.max) * 100).toFixed(2),
			hits: utils.addCommas(String(groupCache.hits)),
			misses: utils.addCommas(String(groupCache.misses)),
			hitRatio: (groupCache.hits / (groupCache.hits + groupCache.misses)).toFixed(4),
			enabled: groupCache.enabled,
		},
		localCache: {
			length: localCache.length,
			max: localCache.max,
			itemCount: localCache.itemCount,
			percentFull: ((localCache.length / localCache.max) * 100).toFixed(2),
			hits: utils.addCommas(String(localCache.hits)),
			misses: utils.addCommas(String(localCache.misses)),
			hitRatio: ((localCache.hits / (localCache.hits + localCache.misses) || 0)).toFixed(4),
			enabled: localCache.enabled,
		},
	};

	if (objectCache) {
		data.objectCache = {
			length: objectCache.length,
			max: objectCache.max,
			itemCount: objectCache.itemCount,
			percentFull: ((objectCache.length / objectCache.max) * 100).toFixed(2),
			hits: utils.addCommas(String(objectCache.hits)),
			misses: utils.addCommas(String(objectCache.misses)),
			hitRatio: (objectCache.hits / (objectCache.hits + objectCache.misses)).toFixed(4),
			enabled: objectCache.enabled,
		};
	}

	res.render('admin/advanced/cache', data);
};

cacheController.dump = function (req, res, next) {
	const caches = {
		post: require('../../posts/cache'),
		object: require('../../database').objectCache,
		group: require('../../groups').cache,
		local: require('../../cache'),
	};
	if (!caches[req.query.name]) {
		return next();
	}

	const data = JSON.stringify(caches[req.query.name].dump(), null, 4);
	res.setHeader('Content-disposition', 'attachment; filename= ' + req.query.name + '-cache.json');
	res.setHeader('Content-type', 'application/json');
	res.write(data, function (err) {
		if (err) {
			return next(err);
		}
		res.end();
	});
};
