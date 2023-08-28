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
const ts_md5_1 = require("ts-md5");
const FilePath_1 = __importDefault(require("../FilePath/FilePath"));
const os_1 = __importDefault(require("os"));
module.exports = class Cache {
    constructor(name) {
        this.basePath = `${os_1.default.homedir()}/.khala`;
        this.name = name !== null && name !== void 0 ? name : 'cache/default';
        this.path = FilePath_1.default.filePath(this.basePath, this.name);
        FilePath_1.default.createFolder(this.path);
    }
    tryGet(key, option, bufferBuilder) {
        return __awaiter(this, void 0, void 0, function* () {
            var buffer = yield this.get(key, option);
            if (buffer) {
                return buffer;
            }
            else {
                buffer = yield bufferBuilder();
                yield this.set(buffer, key, option);
                return buffer;
            }
        });
    }
    set(buffer, key, option) {
        return __awaiter(this, void 0, void 0, function* () {
            if (buffer) {
                yield FilePath_1.default.write(this.mixedKey(key, option), buffer);
            }
            else {
                yield FilePath_1.default.delete(this.mixedKey(key, option));
            }
        });
    }
    get(key, option) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FilePath_1.default.data(this.mixedKey(key, option));
        });
    }
    useCache(buffer, option, output, cacheFileBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.useCacheByKey(this.key(buffer), option, output, cacheFileBlock);
        });
    }
    useCacheByKey(key, option, output, cacheFileBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            const mixedKey = this.mixedKey(key, option);
            const buffer = yield FilePath_1.default.data(mixedKey);
            if (buffer) {
                yield FilePath_1.default.write(output, buffer);
                return;
            }
            yield cacheFileBlock();
            yield this.set(yield FilePath_1.default.data(output), mixedKey, option);
        });
    }
    key(buffer) {
        const md5 = new ts_md5_1.Md5();
        md5.appendByteArray(buffer);
        const result = md5.end();
        if (typeof (result) == "string") {
            return result;
        }
        else {
            return "";
        }
    }
    mixedKey(key, option) {
        return FilePath_1.default.filePath(this.path, `${key}@${option}`);
    }
};
//# sourceMappingURL=Cache.js.map