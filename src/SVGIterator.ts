
import SVGFileIteratorNext from "./SVGFileIteratorNext";
import IconConfig from "./config";
import svg2vectordrawable from "svg2vectordrawable";
import fs from "fs/promises";
import FilePath from "./FilePath";
import { optimize } from "svgo"

class SVGIterator implements SVGFileIteratorNext {

    config: IconConfig

    private vectordrawableOptions = {
        floatPrecision: 3, // 数值精度，默认为 2
        xmlTag: true // 添加 XML 文档声明标签，默认为 false
    }

    constructor(config: IconConfig) {
        this.config = config
    }

    public async prepare() {
        await FilePath.createFolder(this.config.outputs.svg2xml)
        await FilePath.createFolder(this.config.outputs.svg2pdf)
        await FilePath.createFolder(this.config.outputs.svg2iconfont)
        await FilePath.createFolder(this.config.outputs.svg2custom_iconfont)
    }

    public async add(file: string) {
        const buffer = await this.compression(await fs.readFile(file))
        const basename = FilePath.basename(file)
        await this.vectordrawable(basename, buffer, file)
        await this.pdf(basename, await this.fixedMissiPtUnits(buffer), file)
    }

    public async finish() {

    }

    private async pdf(basename: string, buffer: Buffer, filepath: string) {
        const filename = FilePath.filename(basename, 'pdf')
        const path = FilePath.filePath(this.config.outputs.svg2pdf, filename)
        require('shelljs').exec('inkscape ' + filepath + ' --export-type=pdf --export-filename=' + path)
    }

    private async vectordrawable(basename: string, buffer: Buffer, filepath: string) {
        const xml = await svg2vectordrawable(buffer.toString(), this.vectordrawableOptions)
        const filename = FilePath.filename(basename, 'xml')
        const path = FilePath.filePath(this.config.outputs.svg2xml, filename)
        await fs.writeFile(path, xml)
    }

    private async fixedMissiPtUnits(buffer: Buffer): Promise<Buffer> {
        const result = optimize(buffer, {
            path: undefined,
            plugins: [
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
        return Buffer.from(result.data, 'utf8');
    }

    private async compression(buffer: Buffer): Promise<Buffer> {
        const result = optimize(buffer, {
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
        })

        return Buffer.from(result.data, 'utf8');
    }

}

export = SVGIterator