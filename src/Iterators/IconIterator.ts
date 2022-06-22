import FileIteratorNext from "./FileIteratorNext";
import sharp from 'sharp';
import FilePath from "../FilePath/FilePath";
import SVGFileIteratorNext from "./SVGFileIteratorNext";
import Coverter from "../Config/Coverter";
import CoverterType from "../Config/CoverterType";
import Cache from "../Cache/Cache";

class IconIterator implements FileIteratorNext {

    coverters: Record<string, Coverter[]>
    nexts: SVGFileIteratorNext[]
    cache: Cache = new Cache()

    constructor(coverters: Coverter[], nexts: SVGFileIteratorNext[]) {
        this.coverters = {}
        coverters.filter((item) => {
            return item.type == CoverterType.icon || item.type == CoverterType.gif
        }).forEach((item) => {
            if (!this.coverters[item.type.rawValue]) {
                this.coverters[item.type.rawValue] = []
            }
            this.coverters[item.type.rawValue].push(item)
        })
        this.nexts = nexts
    }

    async prepare() {
        for (const next of this.nexts) {
            await next.prepare()
        }
    }

    async add(path: string) {
        try {

            const buffer = await FilePath.data(path)
            if (!buffer) {
                throw new Error(`[khala] 文件存在问题 ${path}`)
            }

            const file = sharp(buffer, { animated: true })
            const metadata = await file.metadata()

            if (metadata.format == "svg") {
                for (const next of this.nexts) {
                    const buffer = await FilePath.data(path)
                    if (buffer) {

                        await next.add(path, buffer, this.cache.key(buffer))
                    }
                }
                return
            }

            if (metadata.format == "gif") {
                for (const item of this.coverters[CoverterType.gif.rawValue]) {
                    await FilePath.copyToFolder(item.output.path, path)
                }
                return
            }

            if ((metadata.format == 'png' || metadata.format == 'jpg' || metadata.format == 'jpeg') == false) {
                throw new Error(`[khala] 图片格式无法解析 ${path}`)
            }

            if (metadata.width == undefined || metadata.height == undefined) {
                throw new Error(`[khala] 图片宽高存在问题 ${path}`)
            }

            for (const item of this.coverters[CoverterType.icon.rawValue]) {
                const basename = FilePath.basename(path)
                const output = FilePath.filePath(item.output.path, FilePath.filename(basename.name + item.output.icon_suffix, basename.ext))

                const width = Math.round(metadata.width / item.icon_scale * item.output.icon_scale)
                const height = Math.round(metadata.height / item.icon_scale * item.output.icon_scale)

                this.cache.useCache(buffer, 'v2-icon-' + width.toString() + '-' + height.toString(), output, async (complete) => {
                    if (metadata.format == 'jpeg' || metadata.format == 'jpg') {
                        await file
                            .resize({ width: width, height: height })
                            .jpeg({ mozjpeg: true })
                            .toFile(output)
                    } else if (metadata.format == 'png') {
                        var options = file
                            .png({ compressionLevel: 9, palette: true })
                            .resize({ width: width, height: height })
                        await options.toFile(output)
                    } else {
                        await file
                            .resize({ width: width, height: height })
                            .toFile(output)
                    }
                    complete()
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    async finish() {
        for (const next of this.nexts) {
            await next.finish()
        }
    }

}

export = IconIterator