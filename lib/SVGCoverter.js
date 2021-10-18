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
const config_1 = __importDefault(require("./config"));
const fs = __importStar(require("fs/promises"));
const svg2vectordrawable_1 = __importDefault(require("svg2vectordrawable"));
const FilePath_1 = __importDefault(require("./FilePath"));
class Glyphs {
    constructor(name, font_class, unicode_value, unicode, data) {
        this.name = name;
        this.font_class = font_class;
        this.unicode = unicode;
        this.unicode_value = unicode_value;
        this.data = data;
    }
}
class SVGCoverter {
    constructor() {
        this.iconfont = SVGCoverter.font('iconfont');
        this.customIconfont = SVGCoverter.font(config_1.default.outputs.custom_iconfont_family);
        this.glyphs = [];
    }
    static font(fontFamily) {
        var font = require('font-carrier').create();
        const ttfOptions = font.getFontface().options;
        ttfOptions.fontFamily = fontFamily;
        font.setFontface(ttfOptions);
        return font;
    }
    vectordrawable(coverter, file, name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                floatPrecision: 3,
                fillBlack: true,
                xmlTag: true // 添加 XML 文档声明标签，默认为 false
            };
            const xml = yield svg2vectordrawable_1.default(data.toString(), options);
            const filename = FilePath_1.default.filename(name, 'xml');
            const path = FilePath_1.default.path(config_1.default.outputs.svg2xml, filename);
            yield fs.writeFile(path, xml);
        });
    }
    run(coverter, file, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fs.readFile(file);
            yield coverter.pdf(coverter, file, name, data);
            yield coverter.vectordrawable(coverter, file, name, data);
            yield coverter.iconfontGlyphs(coverter, file, name, data);
        });
    }
    iconfontGlyphs(coverter, file, name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const unicode = String.fromCharCode(0xe000 + coverter.glyphs.length);
            const unicodeHex = unicode.charCodeAt(0).toString(16);
            const dataRawValue = String(data);
            coverter.iconfont.setSvg(unicode, dataRawValue);
            coverter.customIconfont.setSvg(unicode, dataRawValue);
            coverter.glyphs.push(new Glyphs(FilePath_1.default.filename(name, ""), "iconfont", unicode, unicodeHex, dataRawValue));
        });
    }
    iconfontTTF(coverter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (true) {
                const path = FilePath_1.default.path(config_1.default.outputs.svg2iconfont, FilePath_1.default.filename("iconfont", ""));
                coverter.iconfont.output({ path: path, types: ['ttf'] });
            }
            if (true) {
                const path = FilePath_1.default.path(config_1.default.outputs.svg2custom_iconfont, FilePath_1.default.filename("iconfont", ""));
                coverter.customIconfont.output({ path: path, types: ['ttf'] });
            }
        });
    }
    iconfontJSON(coverter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (true) {
                const path = FilePath_1.default.path(config_1.default.outputs.svg2iconfont, FilePath_1.default.filename("iconfont", "json"));
                yield fs.writeFile(path, JSON.stringify({
                    font_family: 'iconfont',
                    glyphs: coverter.glyphs,
                }, null, 2));
            }
            if (true) {
                const path = FilePath_1.default.path(config_1.default.outputs.svg2custom_iconfont, FilePath_1.default.filename("iconfont", "json"));
                yield fs.writeFile(path, JSON.stringify({
                    font_family: config_1.default.outputs.custom_iconfont_family,
                    glyphs: coverter.glyphs,
                }, null, 2));
            }
        });
    }
    iconfontHtml(coverter) {
        return __awaiter(this, void 0, void 0, function* () {
            const HTML = (font_family) => {
                return `<style type="text/css">
            @font-face {
                font-family: '${font_family}';
                src: url('iconfont.eot'); /* IE9 */
                src: url('iconfont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
                url('iconfont.woff') format('woff2'),
                url('iconfont.woff') format('woff'), /* chrome、firefox */
                url('iconfont.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
                url('iconfont.svg#iconfont') format('svg'); /* iOS 4.1- */
            }

            .iconfont {
                font-family: "${font_family}";
                font-size: 16px;
                font-style: normal;
            }
            </style>`;
            };
            const List = (glyphs) => {
                var result = '';
                for (const iterator of glyphs) {
                    result += '<span class="iconfont">' + iterator.unicode_value + '</span>\n';
                }
                return result;
            };
            if (true) {
                const html = HTML('iconfont') + List(coverter.glyphs);
                const path = FilePath_1.default.path(config_1.default.outputs.svg2iconfont, FilePath_1.default.filename("iconfont", "html"));
                yield fs.writeFile(path, html);
            }
            if (true) {
                const html = HTML(config_1.default.outputs.custom_iconfont_family) + List(coverter.glyphs);
                const path = FilePath_1.default.path(config_1.default.outputs.svg2custom_iconfont, FilePath_1.default.filename("iconfont", "html"));
                yield fs.writeFile(path, html);
            }
        });
    }
    pdf(coverter, file, name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = FilePath_1.default.path(config_1.default.outputs.svg2pdf, FilePath_1.default.filename(name, "pdf"));
            require('shelljs').exec('inkscape ' + file + ' --export-type=pdf --export-filename=' + path);
        });
    }
    finish(coverter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield coverter.iconfontTTF(coverter);
            yield coverter.iconfontHtml(coverter);
            yield coverter.iconfontJSON(coverter);
        });
    }
}
module.exports = new SVGCoverter();
//# sourceMappingURL=SVGCoverter.js.map