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
const FilePath_1 = __importDefault(require("../FilePath/FilePath"));
const CoverterOutputType_1 = __importDefault(require("../Config/CoverterOutputType"));
const CoverterType_1 = __importDefault(require("../Config/CoverterType"));
const ts_md5_1 = require("ts-md5");
const Cache_1 = __importDefault(require("../Cache/Cache"));
class Glyphs {
    constructor(name, font_class, unicode_value, unicode, file, key) {
        this.name = name;
        this.font_class = font_class;
        this.unicode = unicode;
        this.unicode_value = unicode_value;
        this.file = file;
        this.key = key;
    }
}
class SVGFontIterator {
    constructor(coverters) {
        this.glyphs = [];
        this.cache = new Cache_1.default();
        this.coverters = coverters.filter((item) => {
            return item.type == CoverterType_1.default.svg && item.output.type == CoverterOutputType_1.default.iconfont;
        });
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    add(file, buffer, key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.addGlyph(FilePath_1.default.basename(file).name, file, key);
        });
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const item of this.coverters) {
                yield this.output(item.output.path, item.output.iconfont_family_name, item.output.iconfont_font_name);
            }
        });
    }
    addGlyph(basename, file, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const unicode = String.fromCharCode(0xe000 + this.glyphs.length);
            const unicodeHex = unicode.charCodeAt(0).toString(16);
            this.glyphs.push(new Glyphs(basename, "iconfont", unicode, unicodeHex, file, key));
        });
    }
    output(folder, fontFamily, fontName) {
        return __awaiter(this, void 0, void 0, function* () {
            const md5 = new ts_md5_1.Md5();
            md5.appendStr(fontFamily);
            md5.appendStr(fontName);
            for (const glyph of this.glyphs) {
                md5.appendStr(glyph.key);
            }
            const cacheKey = md5.end();
            const ttf = yield this.cache.value(cacheKey, `ttf-${fontFamily}-${fontName}`);
            const ttfOutput = FilePath_1.default.filePath(folder, FilePath_1.default.filename("iconfont", "ttf"));
            this.cache.useCacheByKey(cacheKey, `iconfont-ttf-${fontFamily}-${fontName}`, ttfOutput, (complete) => __awaiter(this, void 0, void 0, function* () {
                yield this.writeTTF(folder, fontFamily, fontName);
                complete();
            }));
            const jsonOutput = FilePath_1.default.filePath(folder, FilePath_1.default.filename("iconfont", "json"));
            this.cache.useCacheByKey(cacheKey, `iconfont-json-${fontFamily}-${fontName}`, jsonOutput, (complete) => __awaiter(this, void 0, void 0, function* () {
                yield this.writeJSON(jsonOutput, fontFamily, fontName);
                complete();
            }));
            const htmlOutput = FilePath_1.default.filePath(folder, FilePath_1.default.filename("iconfont", "html"));
            this.cache.useCacheByKey(cacheKey, `iconfont-html-${fontFamily}-${fontName}`, htmlOutput, (complete) => __awaiter(this, void 0, void 0, function* () {
                yield this.writeHTML(htmlOutput, fontFamily, fontName);
                complete();
            }));
        });
    }
    writeTTF(folder, fontFamily, fontName) {
        return __awaiter(this, void 0, void 0, function* () {
            var font = require('font-carrier').create();
            const ttfOptions = font.getFontface().options;
            ttfOptions.fontFamily = fontFamily;
            font.options.id = fontName;
            font.setFontface(ttfOptions);
            for (const glyph of this.glyphs) {
                const data = yield promises_1.default.readFile(glyph.file);
                font.setSvg(glyph.unicode_value, data.toString());
            }
            const path = FilePath_1.default.filePath(folder, FilePath_1.default.filename("iconfont", ""));
            font.output({ path: path, types: ['ttf'] });
        });
    }
    writeJSON(path, fontFamily, fontName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield promises_1.default.writeFile(path, JSON.stringify({
                font_family: fontFamily,
                font_name: fontName,
                glyphs: this.glyphs,
            }, null, 2));
        });
    }
    writeHTML(path, fontFamily, fontName) {
        return __awaiter(this, void 0, void 0, function* () {
            var HTML = `<style type="text/css">
        @font-face {
            font-family: '${fontFamily}';
            src: url('iconfont.eot'); /* IE9 */
            src: url('iconfont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
            url('iconfont.woff') format('woff2'),
            url('iconfont.woff') format('woff'), /* chrome、firefox */
            url('iconfont.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
            url('iconfont.svg#iconfont') format('svg'); /* iOS 4.1- */
        }

        .iconfont {
            font-family: "${fontFamily}";
            font-size: 16px;
            font-style: normal;
        }
        </style>`;
            for (const glyph of this.glyphs) {
                HTML += '\n<span class="iconfont">' + glyph.unicode_value + '</span>';
            }
            yield promises_1.default.writeFile(path, HTML);
        });
    }
}
module.exports = SVGFontIterator;
//# sourceMappingURL=SVGFontIterator.js.map