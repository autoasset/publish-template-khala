import FileIteratorNext from "./FileIteratorNext";
import sharp from 'sharp';
import FilePath from "../FilePath/FilePath";
import SVGFileIteratorNext from "./SVGFileIteratorNext";
import Coverter from "../Config/Coverter";
import CoverterType from "../Config/CoverterType";
import Cache from "../Cache/Cache";
import imageminPngquant from "imagemin-pngquant";
import Temp from "../Cache/Temp";

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

            for (const coverter of this.coverters[CoverterType.icon.rawValue]) {
                const basename = FilePath.basename(path)
                const output = FilePath.filePath(coverter.output.path, FilePath.filename(basename.name + coverter.output.icon_suffix, basename.ext))

                const width = Math.round(metadata.width / coverter.icon_scale * coverter.output.icon_scale)
                const height = Math.round(metadata.height / coverter.icon_scale * coverter.output.icon_scale)
                await this.cache.useCache(buffer, 'v4-icon-' + width.toString() + '-' + height.toString(), output, async () => {
                    if (metadata.format == 'jpeg' || metadata.format == 'jpg') {
                        await file
                            .resize({ width: width, height: height })
                            .jpeg({ mozjpeg: true })
                            .toFile(output)
                    } else if (metadata.format == 'png') {
                        await this.png(file, width, height, output, coverter);
                    } else {
                        await file
                            .resize({ width: width, height: height })
                            .toFile(output)
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    private async png(
        file: sharp.Sharp,
        width: number,
        height: number,
        dest: string,
        coverter: Coverter) {
        const options = file.resize({ width: width, height: height });
        const buffer = await options.png().toBuffer();

        if (buffer.length <= coverter.enable_compression_minimum_size) {
            await FilePath.write(dest, buffer);
            return
        }
        
        const imagemin = (await import('imagemin')).buffer;
        const data = await imagemin(buffer, {
            plugins: [
                imageminPngquant({
                    quality: [coverter.output.minimum_quality, coverter.output.maximum_quality]
                })
            ]
        });
        await FilePath.write(dest, data);
    }

    async finish() {
        for (const next of this.nexts) {
            await next.finish()
        }
    }

}

export = IconIterator