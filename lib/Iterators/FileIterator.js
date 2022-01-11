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
const FilePath_1 = __importDefault(require("../FilePath/FilePath"));
const CoverterType_1 = __importDefault(require("../Config/CoverterType"));
const CoverterOutputType_1 = __importDefault(require("../Config/CoverterOutputType"));
class FileIterator {
    constructor(task, nexts, report) {
        this.task = task;
        this.report = report;
        this.nexts = nexts;
        this.coverters = task.coverters.filter((item) => {
            return item.type == CoverterType_1.default.file && item.output.type == CoverterOutputType_1.default.file;
        });
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
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
            for (const path of this.task.inputs) {
                yield this.scan(path);
            }
        });
    }
    scan(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield FilePath_1.default.scan(folder);
            for (const file of result.files) {
                if (this.validateIgnore(file.full) == false)
                    continue;
                if (this.validateFileByLints(file.name, file.full) == false)
                    continue;
                yield this.forwardFile(file);
            }
            for (const folder of result.folders) {
                if (this.validateIgnore(folder.full) == false)
                    continue;
                yield this.scan(folder.full);
            }
        });
    }
    forwardFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[khala] 开始处理 ${file.full}`);
            if (this.coverters.length == 0) {
                for (const next of this.nexts) {
                    yield next.add(file.full);
                }
                return;
            }
            for (const coverter of this.coverters) {
                if (coverter.output.file_excludes_same_name_with_different_suffixes) {
                    const basename = FilePath_1.default.basename(file.name).name;
                    const result = yield FilePath_1.default.scan(coverter.output.path);
                    for (const file of result.files) {
                        if (FilePath_1.default.basename(file.name).name == basename) {
                            yield FilePath_1.default.delete(file.full);
                        }
                    }
                }
                yield FilePath_1.default.copyToFolder(coverter.output.path, file.full);
            }
        });
    }
    validateFileByLints(name, path) {
        for (const lint of this.task.fileLints) {
            const reg = new RegExp(lint.pattern, 'g');
            if (reg.test(FilePath_1.default.basename(name).name) == false) {
                this.report.fileLintFail(path, lint);
                return false;
            }
        }
        return true;
    }
    validateIgnore(path) {
        const basename = FilePath_1.default.basename(path);
        /// 排除隐藏文件/目录
        if (basename.full.startsWith('.')) {
            return false;
        }
        /// 是否在排除列表
        for (const exclude of this.task.ignore) {
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