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
const svg2vectordrawable_1 = __importDefault(require("svg2vectordrawable"));
const promises_1 = __importDefault(require("fs/promises"));
const FilePath_1 = __importDefault(require("../FilePath/FilePath"));
const svgo_1 = require("svgo");
const CoverterOutputType_1 = __importDefault(require("../Config/CoverterOutputType"));
const CoverterType_1 = __importDefault(require("../Config/CoverterType"));
const sharp_1 = __importDefault(require("sharp"));
const svg_to_pdfkit_1 = __importDefault(require("svg-to-pdfkit"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const console_1 = __importDefault(require("console"));
const Cache_1 = __importDefault(require("../Cache/Cache"));
class SVGIterator {
    constructor(coverters) {
        this.cache = new Cache_1.default();
        this.vectordrawableOptions = {
            floatPrecision: 3,
            xmlTag: true // 添加 XML 文档声明标签，默认为 false
        };
        this.coverters = coverters.filter((item) => {
            return item.type == CoverterType_1.default.svg && item.output.type != CoverterOutputType_1.default.iconfont;
        });
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    add(file, buffer, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const basename = FilePath_1.default.basename(file).name;
            const compression = yield this.compression(buffer, key);
            for (const coverter of this.coverters) {
                if (coverter.output.type == CoverterOutputType_1.default.pdf) {
                    yield this.pdf(basename, coverter.output, compression, key);
                }
                else if (coverter.output.type == CoverterOutputType_1.default.vector_drawable) {
                    yield this.vectordrawable(basename, coverter.output, compression, key);
                }
                else if (coverter.output.type == CoverterOutputType_1.default.svg) {
                    yield this.svg(basename, coverter.output, compression, key);
                }
            }
        });
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    pdf(basename, output, buffer, cacheKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filename = FilePath_1.default.filename(basename, 'pdf');
                const path = FilePath_1.default.filePath(output.path, filename);
                const file = (0, sharp_1.default)(buffer);
                const metadata = yield file.metadata();
                if (metadata.format != "svg") {
                    return;
                }
                yield this.cache.useCacheByKey(cacheKey, 'pdf', path, () => {
                    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        if (!metadata.width) {
                            return;
                        }
                        if (!metadata.height) {
                            return;
                        }
                        const doc = new pdfkit_1.default({
                            info: {
                                CreationDate: new Date(756230400000)
                            },
                            size: [metadata.width, metadata.height]
                        });
                        const stream = require('fs').createWriteStream(path);
                        const fixedBuffer = yield this.fixedMissiPtUnits(buffer);
                        stream.on('finish', () => __awaiter(this, void 0, void 0, function* () {
                            resolve();
                        }));
                        (0, svg_to_pdfkit_1.default)(doc, fixedBuffer.toString(), 0, 0);
                        doc.pipe(stream);
                        doc.end();
                    }));
                });
            }
            catch (error) {
                console_1.default.log(`[khala] error: ${error}`);
            }
        });
    }
    svg(basename, output, buffer, cacheKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = FilePath_1.default.filename(basename, 'svg');
            const path = FilePath_1.default.filePath(output.path, filename);
            yield this.cache.useCacheByKey(cacheKey, 'compression-svg', path, (() => __awaiter(this, void 0, void 0, function* () {
                yield promises_1.default.writeFile(path, buffer);
            })));
        });
    }
    vectordrawable(basename, output, buffer, cacheKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = FilePath_1.default.filename(basename, 'xml');
            const path = FilePath_1.default.filePath(output.path, filename);
            yield this.cache.useCacheByKey(cacheKey, 'vectordrawable', path, (() => __awaiter(this, void 0, void 0, function* () {
                const xml = yield (0, svg2vectordrawable_1.default)(buffer.toString(), this.vectordrawableOptions);
                yield promises_1.default.writeFile(path, xml);
            })));
        });
    }
    fixedMissiPtUnits(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, svgo_1.optimize)(buffer, {
                path: undefined,
                plugins: [
                    {
                        name: 'SetDefaultWidthHeightUnitToPT',
                        type: 'perItem',
                        fn: (item, params, info) => {
                            if (item.type === 'element' && item.name === 'svg') {
                                if (item.attributes.width != null && Number.isNaN(Number(item.attributes.width)) === false) {
                                    const width = Number(item.attributes.width);
                                    item.attributes.width = `${width}pt`;
                                }
                                if (item.attributes.height != null && Number.isNaN(Number(item.attributes.height)) === false) {
                                    const height = Number(item.attributes.height);
                                    item.attributes.height = `${height}pt`;
                                }
                            }
                        },
                    }
                ],
                js2svg: { pretty: true }
            });
            return Buffer.from(result.data, 'utf8');
        });
    }
    compression(buffer, cacheKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const option = 'svg-compression';
            const cachePath = yield this.cache.value(cacheKey, option);
            if (cachePath) {
                const result = yield FilePath_1.default.data(cachePath);
                if (result) {
                    return result;
                }
            }
            const result = Buffer.from((0, svgo_1.optimize)(buffer, {
                path: undefined,
                plugins: [
                    "removeDoctype",
                    "removeXMLProcInst",
                    "removeComments",
                    "removeMetadata",
                    "removeTitle",
                    "removeDesc",
                    "removeUselessDefs",
                    "removeXMLNS",
                    "removeEditorsNSData",
                    "removeEmptyAttrs",
                    "removeHiddenElems",
                    "removeEmptyText",
                    "removeEmptyContainers",
                    "removeUnknownsAndDefaults",
                    "removeNonInheritableGroupAttrs",
                    "removeUselessStrokeAndFill",
                    "removeUnusedNS",
                    "removeScriptElement"
                ],
                js2svg: { pretty: true }
            }).data, 'utf8');
            yield this.cache.cache(result, cacheKey, option);
            return result;
        });
    }
}
module.exports = SVGIterator;
//# sourceMappingURL=SVGIterator.js.map