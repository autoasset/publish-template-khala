"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const FilePath_1 = __importDefault(require("../FilePath/FilePath"));
const CoverterType_1 = __importDefault(require("../Config/CoverterType"));
const CoverterOutputType_1 = __importDefault(require("../Config/CoverterOutputType"));
const Cache_1 = __importDefault(require("../Cache/Cache"));
const Temp_1 = __importDefault(require("../Cache/Temp"));
const sharp_1 = __importDefault(require("sharp"));
const imagemin_pngquant_1 = __importDefault(require("imagemin-pngquant"));
class IconBuffer {
    constructor(buffer, format) {
        this.buffer = buffer;
        this.format = format;
    }
}
class IconContext {
    constructor(file, metadata, stats, format, coverter, cache, cache_option, cache_key) {
        this.file = file;
        this.stats = stats;
        this.metadata = metadata;
        this.format = format;
        this.cache = cache;
        this.coverter = coverter;
        this.cache_option = cache_option;
        this.cache_key = cache_key;
    }
    static min(list) {
        var item = list[0];
        list.forEach((value) => {
            if (value.buffer.length < item.buffer.length) {
                item = value;
            }
        });
        return item;
    }
    icon() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.format == 'jpeg' || this.format == 'jpg') {
                return this.jpeg();
            }
            else if (this.format == 'png') {
                return yield this.png();
            }
            else {
                return new IconBuffer(yield this.file.toBuffer(), this.format);
            }
        });
    }
    isNotCompression(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.coverter.enable_compression_minimum_size < 0 || buffer.length <= this.coverter.enable_compression_minimum_size) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    jpeg() {
        return __awaiter(this, void 0, void 0, function* () {
            const kind = 'jpg';
            const buffer = yield this.cache.tryGet(this.cache_key, kind + '-' + this.cache_option, () => __awaiter(this, void 0, void 0, function* () {
                var buffer = yield this.file
                    .jpeg({
                    mozjpeg: true
                })
                    .toBuffer();
                if (yield this.isNotCompression(buffer)) {
                    return buffer;
                }
                return yield this.file
                    .jpeg({
                    mozjpeg: true,
                    quality: this.coverter.output.maximum_quality * 100
                })
                    .toBuffer();
            }));
            return new IconBuffer(buffer, kind);
        });
    }
    webp() {
        return __awaiter(this, void 0, void 0, function* () {
            const kind = 'webp';
            const buffer = yield this.cache.tryGet(this.cache_key, kind + '-' + this.cache_option, () => __awaiter(this, void 0, void 0, function* () {
                var buffer = yield this.file
                    .webp({
                    nearLossless: true
                })
                    .toBuffer();
                if (yield this.isNotCompression(buffer)) {
                    return buffer;
                }
                return yield this.file
                    .webp({
                    nearLossless: true,
                    quality: this.coverter.output.maximum_quality * 100
                })
                    .toBuffer();
            }));
            return new IconBuffer(buffer, kind);
        });
    }
    png() {
        return __awaiter(this, void 0, void 0, function* () {
            const kind = 'png';
            const buffer = yield this.cache.tryGet(this.cache_key, kind + '-v2-' + this.cache_option, () => __awaiter(this, void 0, void 0, function* () {
                const buffer = yield this.file.png().toBuffer();
                if (yield this.isNotCompression(buffer)) {
                    return buffer;
                }
                if (this.coverter.enable_compression_imagemin_pngquant) {
                    const imagemin = (yield Promise.resolve().then(() => __importStar(require('imagemin')))).buffer;
                    return yield imagemin(buffer, {
                        plugins: [
                            (0, imagemin_pngquant_1.default)({
                                quality: [
                                    this.coverter.output.minimum_quality,
                                    this.coverter.output.maximum_quality
                                ]
                            })
                        ]
                    });
                }
                else {
                    return yield this.file
                        .png({
                        quality: this.coverter.output.maximum_quality * 100
                    })
                        .toBuffer();
                }
            }));
            return new IconBuffer(buffer, kind);
        });
    }
}
class IconIterator {
    constructor(coverters, nexts) {
        this.cache = new Cache_1.default();
        this.temp = new Temp_1.default();
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
                var file = (0, sharp_1.default)(buffer, { animated: true });
                var metadata;
                try {
                    metadata = yield file.metadata();
                    if (metadata.format == undefined) {
                        return;
                    }
                }
                catch (error) {
                    return;
                }
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
                if (['png', 'jpg', 'jpeg', 'webp'].indexOf(metadata.format) == -1) {
                    throw new Error(`[khala] 图片格式无法解析 ${path}`);
                }
                if (metadata.width == undefined || metadata.height == undefined) {
                    throw new Error(`[khala] 图片宽高存在问题 ${path}`);
                }
                const stats = yield file.stats();
                for (const coverter of this.coverters[CoverterType_1.default.icon.rawValue]) {
                    const basename = FilePath_1.default.basename(path);
                    const width = Math.round(metadata.width / coverter.icon_scale * coverter.output.icon_scale);
                    const height = Math.round(metadata.height / coverter.icon_scale * coverter.output.icon_scale);
                    file = file.resize({ width: width, height: height });
                    const cache_key = this.cache.key(buffer);
                    const cache_option = [
                        width,
                        height,
                        coverter.output.minimum_quality,
                        coverter.output.maximum_quality
                    ].filter((item) => item != undefined)
                        .join("-");
                    const context = new IconContext(file, metadata, stats, metadata.format, coverter, this.cache, cache_option, cache_key);
                    var icon;
                    if (coverter.output.type == CoverterOutputType_1.default.android_smart_mixed) {
                        var list = [];
                        list.push(yield context.webp());
                        list.push(yield context.png());
                        if (stats.isOpaque) {
                            list.push(yield context.jpeg());
                        }
                        icon = IconContext.min(list);
                    }
                    else if (coverter.output.type == CoverterOutputType_1.default.ios_smart_mixed) {
                        var list = [];
                        if (stats.isOpaque && ['jpg', 'jpeg'].indexOf(metadata.format) == -1) {
                            list.push(yield context.jpeg());
                        }
                        list.push(yield context.png());
                        icon = IconContext.min(list);
                    }
                    else {
                        icon = yield context.icon();
                    }
                    const filename = FilePath_1.default.filename(basename.name + coverter.output.icon_suffix, icon.format);
                    const output = FilePath_1.default.filePath(coverter.output.path, filename);
                    yield FilePath_1.default.write(output, icon.buffer);
                    var message = "-> ";
                    if (coverter.name) {
                        message += coverter.name + ": ";
                    }
                    message += FilePath_1.default.relativeCWD(output);
                    console.log(message);
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