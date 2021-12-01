import SVGFileIteratorNext from "./SVGFileIteratorNext";
import IconConfig from "./config";
import fs from "fs/promises";
import FilePath from "./FilePath";

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

    config: IconConfig
    glyphs: Glyphs[] = []

    constructor(config: IconConfig) {
        this.config = config
    }

    public async prepare() {
        await FilePath.createFolder(this.config.outputs.svg2iconfont)
        await FilePath.createFolder(this.config.outputs.svg2custom_iconfont)
    }

    public async add(file: string) {
        await this.addGlyph(FilePath.filename(FilePath.basename(file), ""), file)
    }

    public async finish() {
        await this.output(this.config.outputs.svg2iconfont, 'iconfont')
        await this.output(this.config.outputs.svg2custom_iconfont, this.config.outputs.custom_iconfont_family)
    }

    private async addGlyph(basename: string, file: string) {
        const unicode = String.fromCharCode(0xe000 + this.glyphs.length)
        const unicodeHex = unicode.charCodeAt(0).toString(16)
        this.glyphs.push(new Glyphs(basename, "iconfont", unicode, unicodeHex, file))
    }

    private async output(folder: string, fontFamily: string) {
       await this.writeTTF(folder, fontFamily)
       await this.writeJSON(folder, fontFamily)
       await this.writeHTML(folder, fontFamily)
    }

    private async writeTTF(folder: string, fontFamily: string) {
        var font = require('font-carrier').create();
        const ttfOptions = font.getFontface().options;
        ttfOptions.fontFamily = fontFamily;
        font.options.id = fontFamily;
        font.setFontface(ttfOptions);      
          
        for (const glyph of this.glyphs) {
            const data = await fs.readFile(glyph.file)
            font.setSvg(glyph.unicode_value, data.toString())
        }

        const path = FilePath.filePath(folder, FilePath.filename("iconfont", ""))
        font.output({ path: path, types: ['ttf'] })
    }

    private async writeJSON(folder: string, fontFamily: string) {
            const path = FilePath.filePath(folder, FilePath.filename("iconfont", "json"))
            await fs.writeFile(path, JSON.stringify({
                font_family: fontFamily,
                glyphs: this.glyphs,
            }, null, 2))
    }

    private async writeHTML(folder: string, fontFamily: string) {
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