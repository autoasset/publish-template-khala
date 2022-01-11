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
const FilePathScanResult_1 = __importDefault(require("./FilePathScanResult"));
const FilePathScanItemResult_1 = __importDefault(require("./FilePathScanItemResult"));
module.exports = class FilePath {
    static filename(name, extension) {
        const basename = this.basename(name);
        return [basename.name, extension].filter(item => item).join(".");
    }
    static filePath(folder, filename) {
        var paths = folder.split(path_1.default.sep);
        paths.push(filename);
        return path_1.default.resolve(paths.join(path_1.default.sep));
    }
    static basename(path) {
        const full = path_1.default.basename(path);
        var ext = "";
        const index = full.indexOf('.');
        if (index == -1) {
            return { name: full, ext: ext, full: full };
        }
        else {
            return { name: full.substring(0, index), ext: full.substring(index + 1, full.length), full: full };
        }
    }
    static scan(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = new FilePathScanResult_1.default();
            const stat = yield promises_1.default.stat(input);
            if (stat.isFile()) {
                result.files.push(new FilePathScanItemResult_1.default(this.basename(input).name, input));
                return result;
            }
            else if (stat.isDirectory()) {
                for (const name of yield promises_1.default.readdir(input)) {
                    const fullPath = `${input}${path_1.default.sep}${name}`;
                    const stat = yield promises_1.default.stat(fullPath);
                    if (stat.isFile()) {
                        result.files.push(new FilePathScanItemResult_1.default(name, fullPath));
                    }
                    else if (stat.isDirectory()) {
                        result.folders.push(new FilePathScanItemResult_1.default(name, fullPath));
                    }
                    else {
                        console.log(`[khala]: 无法识别的文件类型 ${fullPath}`);
                    }
                }
            }
            else {
                console.log(`[khala]: 无法识别的文件类型 ${input}`);
            }
            return result;
        });
    }
    static copyToFolder(folder, path, rename) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createFolder(folder);
            const filename = rename !== null && rename !== void 0 ? rename : path_1.default.basename(path);
            const dest = this.filePath(folder, filename);
            yield this.createFolder(this.folder(dest));
            yield this.copyFile(path, dest);
        });
    }
    static copyFile(src, dest, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            promises_1.default.copyFile(src, dest, mode);
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
};
//# sourceMappingURL=FilePath.js.map