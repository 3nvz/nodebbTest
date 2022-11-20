'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const async = require('async');
const nconf_1 = __importDefault(require("nconf"));
const session = require('express-session');
const semver = require('semver');
const meta_1 = __importDefault(require("../meta"));
const connection = require('./postgres/connection');
const postgresModule = {};
postgresModule.questions = [
    {
        name: 'postgres:host',
        description: 'Host IP or address of your PostgreSQL instance',
        default: nconf_1.default.get('postgres:host') || '127.0.0.1',
    },
    {
        name: 'postgres:port',
        description: 'Host port of your PostgreSQL instance',
        default: nconf_1.default.get('postgres:port') || 5432,
    },
    {
        name: 'postgres:username',
        description: 'PostgreSQL username',
        default: nconf_1.default.get('postgres:username') || '',
    },
    {
        name: 'postgres:password',
        description: 'Password of your PostgreSQL database',
        hidden: true,
        default: nconf_1.default.get('postgres:password') || '',
        before: function (value) { value = value || nconf_1.default.get('postgres:password') || ''; return value; },
    },
    {
        name: 'postgres:database',
        description: 'PostgreSQL database name',
        default: nconf_1.default.get('postgres:database') || 'nodebb',
    },
    {
        name: 'postgres:ssl',
        description: 'Enable SSL for PostgreSQL database access',
        default: nconf_1.default.get('postgres:ssl') || false,
    },
];
postgresModule.init = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const { Pool } = require('pg');
        const connOptions = connection.getConnectionOptions();
        const pool = new Pool(connOptions);
        postgresModule.pool = pool;
        postgresModule.client = pool;
        const client = yield pool.connect();
        try {
            yield checkUpgrade(client);
        }
        catch (err) {
            winston_1.default.error(`NodeBB could not connect to your PostgreSQL database. PostgreSQL returned the following error: ${err.message}`);
            throw err;
        }
        finally {
            client.release();
        }
    });
};
function checkUpgrade(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield client.query(`
SELECT EXISTS(SELECT *
                FROM "information_schema"."columns"
               WHERE "table_schema" = 'public'
                 AND "table_name" = 'objects'
                 AND "column_name" = 'data') a,
       EXISTS(SELECT *
                FROM "information_schema"."columns"
               WHERE "table_schema" = 'public'
                 AND "table_name" = 'legacy_hash'
                 AND "column_name" = '_key') b,
       EXISTS(SELECT *
                FROM "information_schema"."routines"
               WHERE "routine_schema" = 'public'
                 AND "routine_name" = 'nodebb_get_sorted_set_members') c`);
        if (res.rows[0].a && res.rows[0].b && res.rows[0].c) {
            return;
        }
        yield client.query(`BEGIN`);
        try {
            if (!res.rows[0].b) {
                yield client.query(`
CREATE TYPE LEGACY_OBJECT_TYPE AS ENUM (
	'hash', 'zset', 'set', 'list', 'string'
)`);
                yield client.query(`
CREATE TABLE "legacy_object" (
	"_key" TEXT NOT NULL
		PRIMARY KEY,
	"type" LEGACY_OBJECT_TYPE NOT NULL,
	"expireAt" TIMESTAMPTZ DEFAULT NULL,
	UNIQUE ( "_key", "type" )
)`);
                yield client.query(`
CREATE TABLE "legacy_hash" (
	"_key" TEXT NOT NULL
		PRIMARY KEY,
	"data" JSONB NOT NULL,
	"type" LEGACY_OBJECT_TYPE NOT NULL
		DEFAULT 'hash'::LEGACY_OBJECT_TYPE
		CHECK ( "type" = 'hash' ),
	CONSTRAINT "fk__legacy_hash__key"
		FOREIGN KEY ("_key", "type")
		REFERENCES "legacy_object"("_key", "type")
		ON UPDATE CASCADE
		ON DELETE CASCADE
)`);
                yield client.query(`
CREATE TABLE "legacy_zset" (
	"_key" TEXT NOT NULL,
	"value" TEXT NOT NULL,
	"score" NUMERIC NOT NULL,
	"type" LEGACY_OBJECT_TYPE NOT NULL
		DEFAULT 'zset'::LEGACY_OBJECT_TYPE
		CHECK ( "type" = 'zset' ),
	PRIMARY KEY ("_key", "value"),
	CONSTRAINT "fk__legacy_zset__key"
		FOREIGN KEY ("_key", "type")
		REFERENCES "legacy_object"("_key", "type")
		ON UPDATE CASCADE
		ON DELETE CASCADE
)`);
                yield client.query(`
CREATE TABLE "legacy_set" (
	"_key" TEXT NOT NULL,
	"member" TEXT NOT NULL,
	"type" LEGACY_OBJECT_TYPE NOT NULL
		DEFAULT 'set'::LEGACY_OBJECT_TYPE
		CHECK ( "type" = 'set' ),
	PRIMARY KEY ("_key", "member"),
	CONSTRAINT "fk__legacy_set__key"
		FOREIGN KEY ("_key", "type")
		REFERENCES "legacy_object"("_key", "type")
		ON UPDATE CASCADE
		ON DELETE CASCADE
)`);
                yield client.query(`
CREATE TABLE "legacy_list" (
	"_key" TEXT NOT NULL
		PRIMARY KEY,
	"array" TEXT[] NOT NULL,
	"type" LEGACY_OBJECT_TYPE NOT NULL
		DEFAULT 'list'::LEGACY_OBJECT_TYPE
		CHECK ( "type" = 'list' ),
	CONSTRAINT "fk__legacy_list__key"
		FOREIGN KEY ("_key", "type")
		REFERENCES "legacy_object"("_key", "type")
		ON UPDATE CASCADE
		ON DELETE CASCADE
)`);
                yield client.query(`
CREATE TABLE "legacy_string" (
	"_key" TEXT NOT NULL
		PRIMARY KEY,
	"data" TEXT NOT NULL,
	"type" LEGACY_OBJECT_TYPE NOT NULL
		DEFAULT 'string'::LEGACY_OBJECT_TYPE
		CHECK ( "type" = 'string' ),
	CONSTRAINT "fk__legacy_string__key"
		FOREIGN KEY ("_key", "type")
		REFERENCES "legacy_object"("_key", "type")
		ON UPDATE CASCADE
		ON DELETE CASCADE
)`);
                if (res.rows[0].a) {
                    yield client.query(`
INSERT INTO "legacy_object" ("_key", "type", "expireAt")
SELECT DISTINCT "data"->>'_key',
                CASE WHEN (SELECT COUNT(*)
                             FROM jsonb_object_keys("data" - 'expireAt')) = 2
                     THEN CASE WHEN ("data" ? 'value')
                                 OR ("data" ? 'data')
                               THEN 'string'
                               WHEN "data" ? 'array'
                               THEN 'list'
                               WHEN "data" ? 'members'
                               THEN 'set'
                               ELSE 'hash'
                          END
                     WHEN (SELECT COUNT(*)
                             FROM jsonb_object_keys("data" - 'expireAt')) = 3
                     THEN CASE WHEN ("data" ? 'value')
                                AND ("data" ? 'score')
                               THEN 'zset'
                               ELSE 'hash'
                          END
                     ELSE 'hash'
                END::LEGACY_OBJECT_TYPE,
                CASE WHEN ("data" ? 'expireAt')
                     THEN to_timestamp(("data"->>'expireAt')::double precision / 1000)
                     ELSE NULL
                END
  FROM "objects"`);
                    yield client.query(`
INSERT INTO "legacy_hash" ("_key", "data")
SELECT "data"->>'_key',
       "data" - '_key' - 'expireAt'
  FROM "objects"
 WHERE CASE WHEN (SELECT COUNT(*)
                    FROM jsonb_object_keys("data" - 'expireAt')) = 2
            THEN NOT (("data" ? 'value')
                   OR ("data" ? 'data')
                   OR ("data" ? 'members')
                   OR ("data" ? 'array'))
            WHEN (SELECT COUNT(*)
                    FROM jsonb_object_keys("data" - 'expireAt')) = 3
            THEN NOT (("data" ? 'value')
                  AND ("data" ? 'score'))
            ELSE TRUE
       END`);
                    yield client.query(`
INSERT INTO "legacy_zset" ("_key", "value", "score")
SELECT "data"->>'_key',
       "data"->>'value',
       ("data"->>'score')::NUMERIC
  FROM "objects"
 WHERE (SELECT COUNT(*)
          FROM jsonb_object_keys("data" - 'expireAt')) = 3
   AND ("data" ? 'value')
   AND ("data" ? 'score')`);
                    yield client.query(`
INSERT INTO "legacy_set" ("_key", "member")
SELECT "data"->>'_key',
       jsonb_array_elements_text("data"->'members')
  FROM "objects"
 WHERE (SELECT COUNT(*)
          FROM jsonb_object_keys("data" - 'expireAt')) = 2
   AND ("data" ? 'members')`);
                    yield client.query(`
INSERT INTO "legacy_list" ("_key", "array")
SELECT "data"->>'_key',
       ARRAY(SELECT t
               FROM jsonb_array_elements_text("data"->'list') WITH ORDINALITY l(t, i)
              ORDER BY i ASC)
  FROM "objects"
 WHERE (SELECT COUNT(*)
          FROM jsonb_object_keys("data" - 'expireAt')) = 2
   AND ("data" ? 'array')`);
                    yield client.query(`
INSERT INTO "legacy_string" ("_key", "data")
SELECT "data"->>'_key',
       CASE WHEN "data" ? 'value'
            THEN "data"->>'value'
            ELSE "data"->>'data'
       END
  FROM "objects"
 WHERE (SELECT COUNT(*)
          FROM jsonb_object_keys("data" - 'expireAt')) = 2
   AND (("data" ? 'value')
     OR ("data" ? 'data'))`);
                    yield client.query(`DROP TABLE "objects" CASCADE`);
                    yield client.query(`DROP FUNCTION "fun__objects__expireAt"() CASCADE`);
                }
                yield client.query(`
CREATE VIEW "legacy_object_live" AS
SELECT "_key", "type"
  FROM "legacy_object"
 WHERE "expireAt" IS NULL
    OR "expireAt" > CURRENT_TIMESTAMP`);
            }
            if (!res.rows[0].c) {
                yield client.query(`
CREATE FUNCTION "nodebb_get_sorted_set_members"(TEXT) RETURNS TEXT[] AS $$
    SELECT array_agg(z."value" ORDER BY z."score" ASC)
      FROM "legacy_object_live" o
     INNER JOIN "legacy_zset" z
             ON o."_key" = z."_key"
            AND o."type" = z."type"
          WHERE o."_key" = $1
$$ LANGUAGE sql
STABLE
STRICT
PARALLEL SAFE`);
            }
        }
        catch (ex) {
            yield client.query(`ROLLBACK`);
            throw ex;
        }
        yield client.query(`COMMIT`);
    });
}
postgresModule.createSessionStore = function (options) {
    return __awaiter(this, void 0, void 0, function* () {
        function done(db) {
            const sessionStore = require('connect-pg-simple').default(session);
            return new sessionStore({
                pool: db,
                ttl: meta_1.default.getSessionTTLSeconds(),
                pruneSessionInterval: nconf_1.default.get('isPrimary') ? 60 : false,
            });
        }
        const db = yield connection.connect(options);
        if (!nconf_1.default.get('isPrimary')) {
            return done(db);
        }
        yield db.query(`
CREATE TABLE IF NOT EXISTS "session" (
	"sid" CHAR(32) NOT NULL
		COLLATE "C"
		PRIMARY KEY,
	"sess" JSONB NOT NULL,
	"expire" TIMESTAMPTZ NOT NULL
) WITHOUT OIDS;

CREATE INDEX IF NOT EXISTS "session_expire_idx" ON "session"("expire");

ALTER TABLE "session"
	ALTER "sid" SET STORAGE MAIN,
	CLUSTER ON "session_expire_idx";`);
        return done(db);
    });
};
postgresModule.createIndices = function (callback) {
    if (!postgresModule.pool) {
        winston_1.default.warn('[database/createIndices] database not initialized');
        return callback();
    }
    const query = postgresModule.pool.query.bind(postgresModule.pool);
    winston_1.default.info('[database] Checking database indices.');
    async.series([
        async.apply(query, `CREATE INDEX IF NOT EXISTS "idx__legacy_zset__key__score" ON "legacy_zset"("_key" ASC, "score" DESC)`),
        async.apply(query, `CREATE INDEX IF NOT EXISTS "idx__legacy_object__expireAt" ON "legacy_object"("expireAt" ASC)`),
    ], (err) => {
        if (err) {
            winston_1.default.error(`Error creating index ${err.message}`);
            return callback(err);
        }
        winston_1.default.info('[database] Checking database indices done!');
        callback();
    });
};
postgresModule.checkCompatibility = function (callback) {
    const postgresPkg = require('pg/package.json');
    postgresModule.checkCompatibilityVersion(postgresPkg.version, callback);
};
postgresModule.checkCompatibilityVersion = function (version, callback) {
    if (semver.lt(version, '7.0.0')) {
        return callback(new Error('The `pg` package is out-of-date, please run `./nodebb setup` again.'));
    }
    callback();
};
postgresModule.info = function (db) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!db) {
            db = yield connection.connect(nconf_1.default.get('postgres'));
        }
        postgresModule.pool = postgresModule.pool || db;
        const res = yield db.query(`
		SELECT true "postgres",
		   current_setting('server_version') "version",
			 EXTRACT(EPOCH FROM NOW() - pg_postmaster_start_time()) * 1000 "uptime"
	`);
        return Object.assign(Object.assign({}, res.rows[0]), { raw: JSON.stringify(res.rows[0], null, 4) });
    });
};
postgresModule.close = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield postgresModule.pool.end();
    });
};
require('./postgres/main').default(postgresModule);
require('./postgres/hash').default(postgresModule);
require('./postgres/sets').default(postgresModule);
require('./postgres/sorted').default(postgresModule);
require('./postgres/list').default(postgresModule);
require('./postgres/transaction').default(postgresModule);
require('../promisify').promisify(postgresModule, ['client', 'sessionStore', 'pool', 'transaction']);
exports.default = postgresModule;
