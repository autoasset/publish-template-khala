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
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class FilePath {
    static rename(name, removePrefix, removeSubffix, addPrefix, addSubffix, extension) {
        var ext = extension;
        var filename = name;
        if (!extension) {
            const list = name.split(".");
            const paths = list[0].split('/');
            filename = paths[paths.length - 1];
            list.shift();
            ext = list.join(".");
        }
        if (removePrefix && filename.startsWith(removePrefix)) {
            filename = filename.slice(removePrefix.length);
        }
        if (removeSubffix && filename.endsWith(removeSubffix)) {
            filename = filename.slice(0, filename.length - removeSubffix.length - 1);
        }
        filename = addPrefix + filename + addSubffix;
        return [filename, ext].filter(item => item).join(".");
    }
    static filename(name, extension) {
        const index = name.indexOf('.');
        var list = [];
        if (index == -1) {
            list = [name, extension];
        }
        else {
            list = [name.substring(0, index), extension];
        }
        return list.filter(item => item).join(".");
    }
    static filePath(folder, filename) {
        var paths = folder.split(path_1.default.sep);
        paths.push(filename);
        return path_1.default.resolve(paths.join(path_1.default.sep));
    }
    static basename(path) {
        return path_1.default.basename(path);
    }
    static copyToFolder(folder, path, rename) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createFolder(folder);
            const filename = rename !== null && rename !== void 0 ? rename : path_1.default.basename(path);
            const dest = this.filePath(folder, filename);
            yield this.createFolder(this.folder(dest));
            promises_1.default.copyFile(path, dest);
        });
    }
    static delete(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield promises_1.default.rm(path, { recursive: true });
            }
            catch (error) {
            }
        });
    }
    static folder(path) {
        return path_1.default.resolve(path_1.default.dirname(path));
    }
    static write(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createFolder(FilePath.folder(path));
            yield promises_1.default.writeFile(path, data);
        });
    }
    static createFolder(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield promises_1.default.access(path);
            }
            catch (error) {
                try {
                    yield promises_1.default.mkdir(path, { recursive: true });
                }
                catch (error) {
                }
            }
        });
    }
}
module.exports = FilePath;
//# sourceMappingURL=FilePath.js.map