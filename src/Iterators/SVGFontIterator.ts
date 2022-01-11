import SVGFileIteratorNext from "./SVGFileIteratorNext";
import fs from "fs/promises";
import FilePath from "../FilePath/FilePath";
import Coverter from "../Config/Coverter";
import CoverterOutputType from "../Config/CoverterOutputType";
import CoverterType from "../Config/CoverterType";

class Glyphs {
    name: string
    font_class: string
    unicode_value: string
    unicode: string
    file: string

    constructor(name: string,
        font_class: string,
        unicode_value: string,
        unicode: string,
        file: string) {
        this.name = name
        this.font_class = font_class
        this.unicode = unicode
        this.unicode_value = unicode_value
        this.file = file
    }
}

class SVGFontIterator implements SVGFileIteratorNext {

    coverters: Coverter[]
    glyphs: Glyphs[] = []

    constructor(coverters: Coverter[]) {
        this.coverters = coverters.filter((item) => {
            return item.type == CoverterType.svg && item.output.type == CoverterOutputType.iconfont
        })
    }

    public async prepare() {

    }

    public async add(file: string) {
        await this.addGlyph(FilePath.basename(file).name, file)
    }

    public async finish() {
        for (const item of this.coverters) {
            await this.output(item.output.path, item.output.iconfont_family_name, item.output.iconfont_font_name)
        }
    }

    private async addGlyph(basename: string, file: string) {
        const unicode = String.fromCharCode(0xe000 + this.glyphs.length)
        const unicodeHex = unicode.charCodeAt(0).toString(16)
        this.glyphs.push(new Glyphs(basename, "iconfont", unicode, unicodeHex, file))
    }

    private async output(folder: string, fontFamily: string, fontName: string) {
        await this.writeTTF(folder, fontFamily, fontName)
        await this.writeJSON(folder, fontFamily, fontName)
        await this.writeHTML(folder, fontFamily, fontName)
    }

    private async writeTTF(folder: string, fontFamily: string, fontName: string) {
        var font = require('font-carrier').create();
        const ttfOptions = font.getFontface().options;
        ttfOptions.fontFamily = fontFamily;
        font.options.id = fontName;
        font.setFontface(ttfOptions);

        for (const glyph of this.glyphs) {
            const data = await fs.readFile(glyph.file)
            font.setSvg(glyph.unicode_value, data.toString())
        }

        const path = FilePath.filePath(folder, FilePath.filename("iconfont", ""))
        font.output({ path: path, types: ['ttf'] })
    }

    private async writeJSON(folder: string, fontFamily: string, fontName: string) {
        const path = FilePath.filePath(folder, FilePath.filename("iconfont", "json"))
        await fs.writeFile(path, JSON.stringify({
            font_family: fontFamily,
            font_name: fontName,
            glyphs: this.glyphs,
        }, null, 2))
    }

    private async writeHTML(folder: string, fontFamily: string, fontName: string) {
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
        </style>`

        for (const glyph of this.glyphs) {
            HTML += '\n<span class="iconfont">' + glyph.unicode_value + '</span>'
        }

        const path = FilePath.filePath(folder, FilePath.filename("iconfont", "html"))
        await fs.writeFile(path, HTML)
    }

}

export = SVGFontIterator