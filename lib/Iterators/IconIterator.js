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
const sharp_1 = __importDefault(require("sharp"));
const FilePath_1 = __importDefault(require("../FilePath/FilePath"));
const CoverterType_1 = __importDefault(require("../Config/CoverterType"));
const Cache_1 = __importDefault(require("../Cache/Cache"));
class IconIterator {
    constructor(coverters, nexts) {
        this.cache = new Cache_1.default();
        this.coverters = {};
        coverters.filter((item) => {
            return item.type == CoverterType_1.default.icon || item.type == CoverterType_1.default.gif;
        }).forEach((item) => {
            if (!this.coverters[item.type.rawValue]) {
                this.coverters[item.type.rawValue] = [];
            }
            this.coverters[item.type.rawValue].push(item);
        });
        this.nexts = nexts;
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const next of this.nexts) {
                yield next.prepare();
            }
        });
    }
    add(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buffer = yield FilePath_1.default.data(path);
                if (!buffer) {
                    throw new Error(`[khala] 文件存在问题 ${path}`);
                }
                const file = (0, sharp_1.default)(buffer, { animated: true });
                const metadata = yield file.metadata();
                if (metadata.format == "svg") {
                    for (const next of this.nexts) {
                        const buffer = yield FilePath_1.default.data(path);
                        if (buffer) {
                            yield next.add(path, buffer, this.cache.key(buffer));
                        }
                    }
                    return;
                }
                if (metadata.format == "gif") {
                    for (const item of this.coverters[CoverterType_1.default.gif.rawValue]) {
                        yield FilePath_1.default.copyToFolder(item.output.path, path);
                    }
                    return;
                }
                if ((metadata.format == 'png' || metadata.format == 'jpg' || metadata.format == 'jpeg') == false) {
                    throw new Error(`[khala] 图片格式无法解析 ${path}`);
                }
                if (metadata.width == undefined || metadata.height == undefined) {
                    throw new Error(`[khala] 图片宽高存在问题 ${path}`);
                }
                for (const item of this.coverters[CoverterType_1.default.icon.rawValue]) {
                    const basename = FilePath_1.default.basename(path);
                    const output = FilePath_1.default.filePath(item.output.path, FilePath_1.default.filename(basename.name + item.output.icon_suffix, basename.ext));
                    if (item.icon_scale == item.output.icon_scale) {
                        yield FilePath_1.default.copyFile(path, output);
                        continue;
                    }
                    const width = Math.round(metadata.width / item.icon_scale * item.output.icon_scale);
                    const height = Math.round(metadata.height / item.icon_scale * item.output.icon_scale);
                    this.cache.useCache(buffer, 'icon-' + width.toString() + '-' + height.toString(), output, (complete) => __awaiter(this, void 0, void 0, function* () {
                        yield file.resize({ width: width, height: height }).toFile(output);
                        complete();
                    }));
                }
            }
            catch (error) {
                console.log(error);
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
}
module.exports = IconIterator;
//# sourceMappingURL=IconIterator.js.map