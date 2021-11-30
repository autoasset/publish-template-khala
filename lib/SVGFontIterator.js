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
const FilePath_1 = __importDefault(require("./FilePath"));
class Glyphs {
    constructor(name, font_class, unicode_value, unicode, file) {
        this.name = name;
        this.font_class = font_class;
        this.unicode = unicode;
        this.unicode_value = unicode_value;
        this.file = file;
    }
}
class SVGFontIterator {
    constructor(config) {
        this.glyphs = [];
        this.config = config;
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            yield FilePath_1.default.createFolder(this.config.outputs.svg2iconfont);
            yield FilePath_1.default.createFolder(this.config.outputs.svg2custom_iconfont);
        });
    }
    add(file) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.addGlyph(FilePath_1.default.filename(FilePath_1.default.basename(file), ""), file);
        });
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.output(this.config.outputs.svg2iconfont, 'iconfont');
            yield this.output(this.config.outputs.svg2custom_iconfont, this.config.outputs.custom_iconfont_family);
        });
    }
    addGlyph(basename, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const unicode = String.fromCharCode(0xe000 + this.glyphs.length);
            const unicodeHex = unicode.charCodeAt(0).toString(16);
            this.glyphs.push(new Glyphs(basename, "iconfont", unicode, unicodeHex, file));
        });
    }
    output(folder, fontFamily) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writeTTF(folder, fontFamily);
            yield this.writeJSON(folder, fontFamily);
            yield this.writeHTML(folder, fontFamily);
        });
    }
    writeTTF(folder, fontFamily) {
        return __awaiter(this, void 0, void 0, function* () {
            var font = require('font-carrier').create();
            const ttfOptions = font.getFontface().options;
            ttfOptions.fontFamily = fontFamily;
            font.options.id = fontFamily;
            font.setFontface(ttfOptions);
            for (const glyph of this.glyphs) {
                const data = yield promises_1.default.readFile(glyph.file);
                font.setSvg(glyph.unicode, data.toString());
            }
            const path = FilePath_1.default.filePath(folder, FilePath_1.default.filename("iconfont", ""));
            font.output({ path: path, types: ['ttf'] });
        });
    }
    writeJSON(folder, fontFamily) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = FilePath_1.default.filePath(folder, FilePath_1.default.filename("iconfont", "json"));
            yield promises_1.default.writeFile(path, JSON.stringify({
                font_family: fontFamily,
                glyphs: this.glyphs,
            }, null, 2));
        });
    }
    writeHTML(folder, fontFamily) {
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
            const path = FilePath_1.default.filePath(folder, FilePath_1.default.filename("iconfont", "html"));
            yield promises_1.default.writeFile(path, HTML);
        });
    }
}
module.exports = SVGFontIterator;
//# sourceMappingURL=SVGFontIterator.js.map