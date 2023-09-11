
import SVGFileIteratorNext from "./SVGFileIteratorNext";
import svg2vectordrawable from "svg2vectordrawable";
import fs from "fs/promises";
import FilePath from "../FilePath/FilePath";
import { optimize, OptimizedSvg } from "svgo"
import Coverter from "../Config/Coverter";
import CoverterOutput from "../Config/CoverterOutput";
import CoverterOutputType from "../Config/CoverterOutputType";
import CoverterType from "../Config/CoverterType";
import sharp from 'sharp';
import SVGtoPDF from 'svg-to-pdfkit'
import PDFDocument from 'pdfkit'
import console, { error } from "console";
import Cache from "../Cache/Cache";
import { ReportError, ReportHelper } from "../ReportHelper";

class SVGIterator implements SVGFileIteratorNext {

    private report: ReportHelper
    coverters: Coverter[]
    cache: Cache = new Cache()

    constructor(coverters: Coverter[], report: ReportHelper) {
        this.report = report
        this.coverters = coverters.filter((item) => {
            return item.type == CoverterType.svg && item.output.type != CoverterOutputType.iconfont
        })
    }

    public async prepare() {

    }

    async add(file: string, buffer: Buffer, key: string) {
        const basename = FilePath.basename(file).name
        const compression = await this.compression(buffer, key)
        for (const coverter of this.coverters) {
            try {
                if (coverter.output.type == CoverterOutputType.pdf) {
                    await this.pdf(basename, coverter.output, compression, key)
                } else if (coverter.output.type == CoverterOutputType.vector_drawable) {
                    await this.vectordrawable(basename, coverter.output, compression, key)
                } else if (coverter.output.type == CoverterOutputType.svg) {
                    await this.svg(basename, coverter.output, compression, key)
                }
            } catch (error) {
                this.report.errors.push(new ReportError(FilePath.basename(file).full, `svg 转换 ${coverter.output.type.rawValue} 时失败, 请使用 figma 重新生成 svg 文件`))
            }
        }
    }

    public async finish() {

    }

    private async pdf(basename: string, output: CoverterOutput, buffer: Buffer, cacheKey: string) {
        const filename = FilePath.filename(basename, 'pdf')
        const path = FilePath.filePath(output.path, filename)

        const file = sharp(buffer)
        const metadata = await file.metadata()
        if (metadata.format != "svg") {
            return
        }

        await this.cache.useCacheByKey(cacheKey, 'pdf', path, () => {
            return new Promise<void>(async (resolve) => {
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
                const fixedBuffer = await this.fixedMissiPtUnits(buffer)

                stream.on('finish', async () => {
                    resolve()
                })
                SVGtoPDF(doc, fixedBuffer.toString(), 0, 0);
                doc.pipe(stream);
                doc.end();
            })
        })


    }

    private async svg(basename: string, output: CoverterOutput, buffer: Buffer, cacheKey: string) {
        const filename = FilePath.filename(basename, 'svg')
        const path = FilePath.filePath(output.path, filename)
        await this.cache.useCacheByKey(cacheKey, 'compression-svg', path, (async () => {
            await fs.writeFile(path, buffer)
        }))
    }

    private async vectordrawable(basename: string, output: CoverterOutput, buffer: Buffer, cacheKey: string) {
        const filename = FilePath.filename(basename, 'xml')
        const path = FilePath.filePath(output.path, filename)
        let xml = await svg2vectordrawable(buffer.toString(), {
            // 数值精度，默认为 2
            floatPrecision: 3,
        })
        if (xml.indexOf("Color=") == -1) {
            xml = xml.replace('android:pathData=', "android:fillColor=\"#FF333333\"\n        android:pathData=")
        }
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
        }) as OptimizedSvg
        return Buffer.from(result.data, 'utf8');
    }

    private async compression(buffer: Buffer, cacheKey: string): Promise<Buffer> {
        const option = 'svg-compression'
        const cachePath = await this.cache.mixedKey(cacheKey, option)
        if (cachePath) {
            const result = await FilePath.data(cachePath)
            if (result) {
                return result
            }
        }
        const result = Buffer.from((optimize(buffer, {
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
        }) as OptimizedSvg).data, 'utf8');

        await this.cache.set(result, cacheKey, option)
        return result
    }

}

export = SVGIterator