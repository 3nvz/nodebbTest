/* eslint-disable no-await-in-loop */
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
const batch = require('../../batch');
exports.default = {
    name: 'add filters to events',
    timestamp: Date.UTC(2018, 9, 4),
    method: function () {
        return __awaiter(this, void 0, void 0, function* () {
            const { progress } = this;
            yield batch.processSortedSet('events:time', (eids) => __awaiter(this, void 0, void 0, function* () {
                for (const eid of eids) {
                    progress.incr();
                    const eventData = yield database_1.default.getObject(`event:${eid}`);
                    if (!eventData) {
                        yield database_1.default.sortedSetRemove('events:time', eid);
                        return;
                    }
                    // privilege events we're missing type field
                    if (!eventData.type && eventData.privilege) {
                        eventData.type = 'privilege-change';
                        yield database_1.default.setObjectField(`event:${eid}`, 'type', 'privilege-change');
                        yield database_1.default.sortedSetAdd(`events:time:${eventData.type}`, eventData.timestamp, eid);
                        return;
                    }
                    yield database_1.default.sortedSetAdd(`events:time:${eventData.type || ''}`, eventData.timestamp, eid);
                }
            }), {
                progress: this.progress,
            });
        });
    },
};
