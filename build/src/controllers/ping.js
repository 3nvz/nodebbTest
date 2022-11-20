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
const nconf_1 = __importDefault(require("nconf"));
const database_1 = __importDefault(require("../database"));
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.default.getObject('config');
            res.status(200).send(req.path === `${nconf_1.default.get('relative_path')}/sping` ? 'healthy' : '200');
        }
        catch (err) {
            next(err);
        }
    });
}
exports.default = default_1;
;
