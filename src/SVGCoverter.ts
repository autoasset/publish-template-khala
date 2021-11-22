import config from "./config";
import * as fs from "fs/promises";
import svg2vectordrawable from "svg2vectordrawable";
import FilePath from "./FilePath"
import { optimize } from "svgo"

class Glyphs {
    name: string
    font_class: string
    unicode_value: string
    unicode: string
    data: string

    constructor(name: string,
        font_class: string,
        unicode_value: string,
        unicode: string,
        data: string) {
        this.name = name
        this.font_class = font_class
        this.unicode = unicode
        this.unicode_value = unicode_value
        this.data = data
    }
}

class SVGCoverter {

    static font(fontFamily: string): any {
        var font = require('font-carrier').create();
        const ttfOptions = font.getFontface().options;
        ttfOptions.fontFamily = fontFamily;
        font.setFontface(ttfOptions);
        return font;
    }


    iconfont: any = SVGCoverter.font('iconfont')
    customIconfont: any = SVGCoverter.font(config.outputs.custom_iconfont_family)
    glyphs: Glyphs[] = []

    async vectordrawable(coverter: SVGCoverter, file: string, name: string, data: Buffer) {

        const options = {
            floatPrecision: 3, // 数值精度，默认为 2
            xmlTag: true // 添加 XML 文档声明标签，默认为 false
        }

        const xml = await svg2vectordrawable(data.toString(), options)
        const filename = FilePath.filename(name, 'xml')
        const path = FilePath.path(config.outputs.svg2xml, filename)
        await fs.writeFile(path, xml)
    }

    async run(coverter: SVGCoverter, file: string, name: string) {
        const result = optimize(await fs.readFile(file), {
            path: file,
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
                "removeScriptElement",
                {
                    name: 'SetDefaultWidthHeightUnitToPT',
                    type: 'perItem', // 'perItem', 'perItemReverse' or 'full'
                    fn: (item, params, info) => {
                        if (item.type === 'element' && item.name === 'svg') {
                            if (item.attributes.width != null && Number.isNaN(Number(item.attributes.width)) === false) {
                                const width = Number(item.attributes.width);
                                item.attributes.width = `${width}pt`
                            }
                            if (item.attributes.height != null && Number.isNaN(Number(item.attributes.height)) === false) {
                                const height = Number(item.attributes.height);
                                item.attributes.height = `${height}pt`
                            }
                        }
                    },
                }
            ],
            js2svg: { pretty: true }
        })

        const data = Buffer.from(result.data, 'utf8');
        const path = FilePath.path(config.outputs.svg, name)

        await fs.writeFile(path, result.data)
        await coverter.pdf(coverter, path, name, data)
        await coverter.vectordrawable(coverter, path, name, data)
        await coverter.iconfontGlyphs(coverter, path, name, data)
    }

    async iconfontGlyphs(coverter: SVGCoverter, file: string, name: string, data: Buffer) {
        const unicode = String.fromCharCode(0xe000 + coverter.glyphs.length)
        const unicodeHex = unicode.charCodeAt(0).toString(16)
        const dataRawValue = String(data)
        coverter.iconfont.setSvg(unicode, dataRawValue)
        coverter.customIconfont.setSvg(unicode, dataRawValue)
        coverter.glyphs.push(new Glyphs(FilePath.filename(name, ""), "iconfont", unicode, unicodeHex, dataRawValue))
    }

    async iconfontTTF(coverter: SVGCoverter) {
        if (true) {
            const path = FilePath.path(config.outputs.svg2iconfont, FilePath.filename("iconfont", ""))
            coverter.iconfont.output({ path: path, types: ['ttf'] })
        }

        if (true) {
            const path = FilePath.path(config.outputs.svg2custom_iconfont, FilePath.filename("iconfont", ""))
            coverter.customIconfont.output({ path: path, types: ['ttf'] })
        }
    }

    async iconfontJSON(coverter: SVGCoverter) {
        if (true) {
            const path = FilePath.path(config.outputs.svg2iconfont, FilePath.filename("iconfont", "json"))
            await fs.writeFile(path, JSON.stringify({
                font_family: 'iconfont',
                glyphs: coverter.glyphs,
            }, null, 2))
        }
        if (true) {
            const path = FilePath.path(config.outputs.svg2custom_iconfont, FilePath.filename("iconfont", "json"))
            await fs.writeFile(path, JSON.stringify({
                font_family: config.outputs.custom_iconfont_family,
                glyphs: coverter.glyphs,
            }, null, 2))
        }
    }

    async iconfontHtml(coverter: SVGCoverter) {

        const HTML = (font_family: string): string => {
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
            </style>`
        }

        const List = (glyphs: Glyphs[]): string => {
            var result = ''
            for (const iterator of glyphs) {
                result += '<span class="iconfont">' + iterator.unicode_value + '</span>\n'
            }
            return result
        }

        if (true) {
            const html = HTML('iconfont') + List(coverter.glyphs)
            const path = FilePath.path(config.outputs.svg2iconfont, FilePath.filename("iconfont", "html"))
            await fs.writeFile(path, html)
        }

        if (true) {
            const html = HTML(config.outputs.custom_iconfont_family) + List(coverter.glyphs)
            const path = FilePath.path(config.outputs.svg2custom_iconfont, FilePath.filename("iconfont", "html"))
            await fs.writeFile(path, html)
        }
    }

    async pdf(coverter: SVGCoverter, file: string, name: string, data: Buffer) {
        const path = FilePath.path(config.outputs.svg2pdf, FilePath.filename(name, "pdf"))
        require('shelljs').exec('inkscape ' + file + ' --export-type=pdf --export-filename=' + path)
    }

    async finish(coverter: SVGCoverter) {
        await coverter.iconfontTTF(coverter)
        await coverter.iconfontHtml(coverter)
        await coverter.iconfontJSON(coverter)
    }
}


export = new SVGCoverter();