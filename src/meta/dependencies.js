'use strict';

var path = require('path');
var fs = require('fs');
var async = require('async');
var semver = require('semver');
var winston = require('winston');
require('colors');

var pkg = require('../../package.json');

var dependencies = module.exports;

dependencies.check = function (callback) {
	var modules = Object.keys(pkg.dependencies);
	var depsOutdated = false;
	var depsMissing = false;

	winston.verbose('Checking dependencies for outdated modules');

	async.every(modules, function (module, next) {
		fs.readFile(path.join(__dirname, '../../node_modules/', module, 'package.json'), {
			encoding: 'utf-8',
		}, function (err, pkgData) {
			// If a bundled plugin/theme is not present, skip the dep check (#3384)
			if (err && err.code === 'ENOENT' && (module === 'nodebb-rewards-essentials' || module.startsWith('nodebb-plugin') || module.startsWith('nodebb-theme'))) {
				winston.warn('[meta/dependencies] Bundled plugin ' + module + ' not found, skipping dependency check.');
				return next(true);
			}

			try {
				pkgData = JSON.parse(pkgData);
			} catch (e) {
				process.stdout.write('[' + 'missing'.red + '] ' + module.bold + ' is a required dependency but could not be found\n');
				depsMissing = true;
				return next(true);
			}

			var ok = !semver.validRange(pkg.dependencies[module]) || semver.satisfies(pkgData.version, pkg.dependencies[module]);

			if (ok || (pkgData._resolved && pkgData._resolved.indexOf('//github.com') !== -1)) {
				next(true);
			} else {
				process.stdout.write('[' + 'outdated'.yellow + '] ' + module.bold + ' installed v' + pkgData.version + ', package.json requires ' + pkg.dependencies[module] + '\n');
				depsOutdated = true;
				next(true);
			}
		});
	}, function () {
		if (depsMissing) {
			callback(new Error('dependencies-missing'));
		} else if (depsOutdated) {
			callback(global.env !== 'development' ? new Error('dependencies-out-of-date') : null);
		} else {
			callback(null);
		}
	});
};
