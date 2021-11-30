"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const FilePath_1 = __importDefault(require("./FilePath"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs/promises"));
class FileIterator {
    constructor(config, nexts) {
        this.config = config;
        this.nexts = nexts;
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            /// 清理输出文件夹
            yield this.delete(this.config.outputs.allPaths);
            yield this.createDirs(this.config.outputs.allPaths);
            for (const next of this.nexts) {
                yield next.prepare();
            }
        });
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const next of this.nexts) {
                yield next.finish();
            }
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const path of this.config.inputs) {
                yield this.forward(path);
            }
        });
    }
    scan(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const path of yield fs.readdir(folder)) {
                yield this.forward(`${folder}${path_1.default.sep}${path}`);
            }
        });
    }
    forward(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.validate(path) == false) {
                return;
            }
            const stat = yield fs.stat(path);
            if (stat.isDirectory()) {
                yield this.scan(path);
            }
            else if (stat.isFile()) {
                for (const next of this.nexts) {
                    yield next.add(path);
                }
            }
            else {
                console.log(`scan: ${path} 无法识别的文件类型`);
            }
        });
    }
    validate(path) {
        /// 排除隐藏文件/目录
        if (path_1.default.basename(path).startsWith('.')) {
            return false;
        }
        /// 是否在排除列表
        for (const exclude of this.config.exclude) {
            if (path.startsWith(exclude)) {
                return false;
            }
        }
        return true;
    }
    createDirs(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const folder of paths.filter(item => item)) {
                yield FilePath_1.default.createFolder(FilePath_1.default.folder(folder));
            }
        });
    }
    delete(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const folder of paths.filter(item => item)) {
                yield FilePath_1.default.delete(folder);
            }
        });
    }
}
module.exports = FileIterator;
//# sourceMappingURL=FileIterator.js.map