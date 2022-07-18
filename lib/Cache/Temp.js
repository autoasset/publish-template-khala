"use strict";
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
var _a;
const FilePath_1 = __importDefault(require("../FilePath/FilePath"));
const os_1 = __importDefault(require("os"));
const crypto_1 = require("crypto");
module.exports = (_a = class Temp {
        constructor() {
            this.path = `${Temp.folder}/${(0, crypto_1.randomUUID)()}`;
        }
        file(name) {
            return __awaiter(this, void 0, void 0, function* () {
                yield FilePath_1.default.createFolder(this.path);
                return FilePath_1.default.filePath(this.path, name);
            });
        }
        // 移除 temp 文件夹
        delete() {
            return __awaiter(this, void 0, void 0, function* () {
                yield FilePath_1.default.delete(this.path);
            });
        }
        // 移除 temp 文件夹
        static deleteAll() {
            return __awaiter(this, void 0, void 0, function* () {
                yield FilePath_1.default.delete(this.folder);
            });
        }
    },
    _a.ID = (0, crypto_1.randomUUID)(),
    _a.folder = `${os_1.default.homedir()}/.khala/temp/${_a.ID}`,
    _a);
//# sourceMappingURL=Temp.js.map