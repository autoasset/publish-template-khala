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
const sharp_1 = __importDefault(require("sharp"));
const FilePath_1 = __importDefault(require("../FilePath/FilePath"));
const CoverterType_1 = __importDefault(require("../Config/CoverterType"));
const Cache_1 = __importDefault(require("../Cache/Cache"));
const imagemin_pngquant_1 = __importDefault(require("imagemin-pngquant"));
const Temp_1 = __importDefault(require("../Cache/Temp"));
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
                for (const coverter of this.coverters[CoverterType_1.default.icon.rawValue]) {
                    const basename = FilePath_1.default.basename(path);
                    const output = FilePath_1.default.filePath(coverter.output.path, FilePath_1.default.filename(basename.name + coverter.output.icon_suffix, basename.ext));
                    const width = Math.round(metadata.width / coverter.icon_scale * coverter.output.icon_scale);
                    const height = Math.round(metadata.height / coverter.icon_scale * coverter.output.icon_scale);
                    yield this.cache.useCache(buffer, 'v3-icon-' + width.toString() + '-' + height.toString(), output, () => __awaiter(this, void 0, void 0, function* () {
                        if (metadata.format == 'jpeg' || metadata.format == 'jpg') {
                            yield file
                                .resize({ width: width, height: height })
                                .jpeg({ mozjpeg: true })
                                .toFile(output);
                        }
                        else if (metadata.format == 'png') {
                            yield this.png(file, width, height, output, coverter);
                        }
                        else {
                            yield file
                                .resize({ width: width, height: height })
                                .toFile(output);
                        }
                    }));
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    png(file, width, height, dest, coverter) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = file.resize({ width: width, height: height });
            const buffer = yield options.toBuffer();
            const imagemin = (yield Promise.resolve().then(() => __importStar(require('imagemin')))).buffer;
            const data = yield imagemin(buffer, {
                plugins: [
                    (0, imagemin_pngquant_1.default)({
                        quality: [coverter.output.minimum_quality, coverter.output.maximum_quality]
                    })
                ]
            });
            yield FilePath_1.default.write(dest, data);
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