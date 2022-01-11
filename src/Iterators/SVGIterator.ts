
import SVGFileIteratorNext from "./SVGFileIteratorNext";
import svg2vectordrawable from "svg2vectordrawable";
import fs from "fs/promises";
import FilePath from "../FilePath/FilePath";
import { optimize } from "svgo"
import Coverter from "../Config/Coverter";
import CoverterOutput from "../Config/CoverterOutput";
import CoverterOutputType from "../Config/CoverterOutputType";
import CoverterType from "../Config/CoverterType";
import sharp from 'sharp';
import SVGtoPDF from 'svg-to-pdfkit'
import PDFDocument from 'pdfkit'
import console from "console";

class SVGIterator implements SVGFileIteratorNext {

    coverters: Coverter[]

    private vectordrawableOptions = {
        floatPrecision: 3, // 数值精度，默认为 2
        xmlTag: true // 添加 XML 文档声明标签，默认为 false
    }

    constructor(coverters: Coverter[]) {
        this.coverters = coverters.filter((item) => {
            return item.type == CoverterType.svg && item.output.type != CoverterOutputType.iconfont
        })
    }

    public async prepare() {

    }

    public async add(file: string) {
        const buffer = await this.compression(await fs.readFile(file))
        const basename = FilePath.basename(file).name

        for (const coverter of this.coverters) {
            if (coverter.output.type == CoverterOutputType.pdf) {
                await this.pdf(basename, coverter.output, await this.fixedMissiPtUnits(buffer), file)
            } else if (coverter.output.type == CoverterOutputType.vector_drawable) {
                await this.vectordrawable(basename, coverter.output, buffer, file)
            }
        }
    }

    public async finish() {

    }

    private async pdf(basename: string, output: CoverterOutput, buffer: Buffer, filepath: string) {
        try {
            const filename = FilePath.filename(basename, 'pdf')
            const path = FilePath.filePath(output.path, filename)

            const file = sharp(buffer)
            const metadata = await file.metadata()
            if (metadata.format != "svg") {
                return
            }
            if (!metadata.width) {
                return
            }
            if (!metadata.height) {
                return
            }

            const doc = new PDFDocument({
                info: {
                    CreationDate: new Date(756230400000)
                }, 
                size: [metadata.width, metadata.height]
            })
            const stream = require('fs').createWriteStream(path)
            SVGtoPDF(doc, buffer.toString(), 0, 0);
            doc.pipe(stream);
            doc.end();
        } catch (error) {
            console.log(`[khala] error: ${error}`)
        }
    }

    private async vectordrawable(basename: string, output: CoverterOutput, buffer: Buffer, filepath: string) {
        const xml = await svg2vectordrawable(buffer.toString(), this.vectordrawableOptions)
        const filename = FilePath.filename(basename, 'xml')
        const path = FilePath.filePath(output.path, filename)
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