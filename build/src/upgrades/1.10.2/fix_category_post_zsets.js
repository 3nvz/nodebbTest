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
const database_1 = __importDefault(require("../../database"));
const posts = require('../../posts');
const topics = require('../../topics');
const batch = require('../../batch');
exports.default = {
    name: 'Fix category post zsets',
    timestamp: Date.UTC(2018, 9, 10),
    method: function () {
        return __awaiter(this, void 0, void 0, function* () {
            const { progress } = this;
            const cids = yield database_1.default.getSortedSetRange('categories:cid', 0, -1);
            const keys = cids.map((cid) => `cid:${cid}:pids`);
            yield batch.processSortedSet('posts:pid', (postData) => __awaiter(this, void 0, void 0, function* () {
                const pids = postData.map(p => p.value);
                const topicData = yield posts.getPostsFields(pids, ['tid']);
                const categoryData = yield topics.getTopicsFields(topicData.map((t) => t.tid), ['cid']);
                yield database_1.default.sortedSetRemove(keys, pids);
                const bulkAdd = postData.map((p, i) => ([`cid:${categoryData[i].cid}:pids`, p.score, p.value]));
                yield database_1.default.sortedSetAddBulk(bulkAdd);
                progress.incr(postData.length);
            }), {
                batch: 500,
                progress: progress,
                withScores: true,
            });
        });
    },
};
