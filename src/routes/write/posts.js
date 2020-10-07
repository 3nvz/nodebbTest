'use strict';

const router = require('express').Router();
const middleware = require('../../middleware');
const controllers = require('../../controllers');
const routeHelpers = require('../helpers');

const setupApiRoute = routeHelpers.setupApiRoute;

module.exports = function () {
	const middlewares = [middleware.authenticate];

	setupApiRoute(router, '/:pid', middleware, [...middlewares, middleware.checkRequired.bind(null, ['content'])], 'put', controllers.write.posts.edit);
	setupApiRoute(router, '/:pid', middleware, [...middlewares, middleware.assertPost], 'delete', controllers.write.posts.purge);

	setupApiRoute(router, '/:pid/state', middleware, [...middlewares, middleware.assertPost], 'put', controllers.write.posts.restore);
	setupApiRoute(router, '/:pid/state', middleware, [...middlewares, middleware.assertPost], 'delete', controllers.write.posts.delete);

	setupApiRoute(router, '/:pid/vote', middleware, [...middlewares, middleware.checkRequired.bind(null, ['delta']), middleware.assertPost], 'put', controllers.write.posts.vote);
	setupApiRoute(router, '/:pid/vote', middleware, [...middlewares, middleware.assertPost], 'delete', controllers.write.posts.unvote);

	setupApiRoute(router, '/:pid/bookmark', middleware, [...middlewares, middleware.assertPost], 'put', controllers.write.posts.bookmark);
	setupApiRoute(router, '/:pid/bookmark', middleware, [...middlewares, middleware.assertPost], 'delete', controllers.write.posts.unbookmark);

	return router;
};
