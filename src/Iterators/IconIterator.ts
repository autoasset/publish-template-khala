import FileIteratorNext from "./FileIteratorNext";
import FilePath from "../FilePath/FilePath";
import SVGFileIteratorNext from "./SVGFileIteratorNext";
import Coverter from "../Config/Coverter";
import CoverterType from "../Config/CoverterType";
import CoverterOutputType from "../Config/CoverterOutputType";
import Cache from "../Cache/Cache";
import Temp from "../Cache/Temp";
import sharp from "sharp";

class IconBuffer {
    buffer: Buffer
    format: keyof sharp.FormatEnum

    constructor(buffer: Buffer, format: keyof sharp.FormatEnum) {
        this.buffer = buffer
        this.format = format
    }
}

class IconContext {

    file: sharp.Sharp
    stats: sharp.Stats
    metadata: sharp.Metadata
    format: keyof sharp.FormatEnum
    coverter: Coverter
    cache_option: string
    cache_key: string
    cache: Cache

    constructor(file: sharp.Sharp,
        metadata: sharp.Metadata,
        stats: sharp.Stats,
        format: keyof sharp.FormatEnum,
        coverter: Coverter,
        cache: Cache,
        cache_option: string,
        cache_key: string) {
        this.file = file
        this.stats = stats
        this.metadata = metadata
        this.format = format
        this.cache = cache
        this.coverter = coverter
        this.cache_option = cache_option
        this.cache_key = cache_key
    }

    static min(list: IconBuffer[]): IconBuffer {
        var item: IconBuffer = list[0]
        list.forEach((value) => {
            if (value.buffer.length < item.buffer.length) {
                item = value
            }
        })
        return item
    }

    async icon(): Promise<IconBuffer> {
        if (this.format == 'jpeg' || this.format == 'jpg') {
            return this.jpeg()
        } else if (this.format == 'png') {
            return await this.png();
        } else {
            return new IconBuffer(await this.file.toBuffer(), this.format)
        }
    }

    async jpeg(): Promise<IconBuffer> {
        const kind: keyof sharp.FormatEnum = 'jpg'
        const buffer = await this.cache.tryGet(this.cache_key, kind + '-' + this.cache_option, async () => {
            var buffer = await this.file
                .jpeg({
                    mozjpeg: true
                })
                .toBuffer()

            if (this.coverter.enable_compression_minimum_size <= 0 || buffer.length <= this.coverter.enable_compression_minimum_size) {
                return buffer
            }

            return await this.file
                .jpeg({
                    mozjpeg: true,
                    quality: this.coverter.output.maximum_quality * 100
                })
                .toBuffer()
        })
        return new IconBuffer(buffer, kind)
    }

    async webp(): Promise<IconBuffer> {
        const kind: keyof sharp.FormatEnum = 'webp'
        const buffer = await this.cache.tryGet(this.cache_key, kind + '-' + this.cache_option, async () => {
            var buffer = await this.file
                .webp({
                    nearLossless: true
                })
                .toBuffer()

            if (this.coverter.enable_compression_minimum_size <= 0 || buffer.length <= this.coverter.enable_compression_minimum_size) {
                return buffer
            } else {
                return await this.file
                    .webp({
                        nearLossless: true,
                        quality: this.coverter.output.maximum_quality * 100
                    })
                    .toBuffer()
            }
        })
        return new IconBuffer(buffer, kind)
    }

    async png(): Promise<IconBuffer> {
        const kind: keyof sharp.FormatEnum = 'png'
        const buffer = await this.cache.tryGet(this.cache_key, kind + '-' + this.cache_option, async () => {
            const buffer = await this.file.png().toBuffer();

            if (this.coverter.enable_compression_minimum_size <= 0 || buffer.length <= this.coverter.enable_compression_minimum_size) {
                return buffer
            }

            return await this.file
            .png({
                quality: this.coverter.output.maximum_quality * 100
            })
            .toBuffer()
        })
        return new IconBuffer(buffer, kind)
    }

}

class IconIterator implements FileIteratorNext {

    coverters: Record<string, Coverter[]>
    nexts: SVGFileIteratorNext[]
    cache: Cache = new Cache()
    temp: Temp = new Temp()

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

            var file = sharp(buffer, { animated: true })
            const metadata = await file.metadata()

            if (metadata.format == undefined) {
                return
            }

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

            if (['png', 'jpg', 'jpeg', 'webp'].indexOf(metadata.format) == -1) {
                throw new Error(`[khala] 图片格式无法解析 ${path}`)
            }

            if (metadata.width == undefined || metadata.height == undefined) {
                throw new Error(`[khala] 图片宽高存在问题 ${path}`)
            }

            const stats = await file.stats()

            for (const coverter of this.coverters[CoverterType.icon.rawValue]) {
                const basename = FilePath.basename(path)
                const width = Math.round(metadata.width / coverter.icon_scale * coverter.output.icon_scale)
                const height = Math.round(metadata.height / coverter.icon_scale * coverter.output.icon_scale)
                file = file.resize({ width: width, height: height })

                const cache_key = this.cache.key(buffer)
                const cache_option = [
                    width,
                    height,
                    coverter.output.minimum_quality,
                    coverter.output.maximum_quality
                ].filter((item) => item != undefined)
                    .join("-")

                const context = new IconContext(
                    file,
                    metadata,
                    stats,
                    metadata.format,
                    coverter,
                    this.cache,
                    cache_option,
                    cache_key
                )

                var icon: IconBuffer
                if (coverter.output.type == CoverterOutputType.android_smart_mixed) {
                    var list: IconBuffer[] = []
                    list.push(await context.webp())
                    list.push(await context.png())
                    if (stats.isOpaque) {
                        list.push(await context.jpeg())
                    }
                    icon = IconContext.min(list)
                } else if (coverter.output.type == CoverterOutputType.ios_smart_mixed) {
                    var list: IconBuffer[] = []
                    if (stats.isOpaque && ['jpg', 'jpeg'].indexOf(metadata.format) == -1) {
                        list.push(await context.jpeg())
                    }
                    list.push(await context.png())
                    icon = IconContext.min(list)
                } else {
                    icon = await context.icon()

                }

                const filename = FilePath.filename(basename.name + coverter.output.icon_suffix, icon.format)
                const output = FilePath.filePath(coverter.output.path, filename)
                await FilePath.write(output, icon.buffer)
                var message = "-> "
                if (coverter.name) {
                    message += coverter.name + ": "
                }
                message += FilePath.relativeCWD(output)
                console.log(message)
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