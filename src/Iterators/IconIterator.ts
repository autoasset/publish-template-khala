import FileIteratorNext from "./FileIteratorNext";
import sharp from 'sharp';
import FilePath from "../FilePath/FilePath";
import SVGFileIteratorNext from "./SVGFileIteratorNext";
import Coverter from "../Config/Coverter";
import CoverterType from "../Config/CoverterType";

class IconIterator implements FileIteratorNext {

    coverters: Record<string, Coverter[]>
    nexts: SVGFileIteratorNext[]

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
            const file = sharp(path, { animated: true })
            const metadata = await file.metadata()

            if (metadata.format == "svg") {
                for (const next of this.nexts) {
                    await next.add(path)
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

                if (item.icon_scale == item.output.icon_scale) {
                    await FilePath.copyFile(path, output)
                    continue
                }

                await file
                    .resize({
                        width: Math.round(metadata.width / item.icon_scale * item.output.icon_scale),
                        height: Math.round(metadata.height / item.icon_scale * item.output.icon_scale)
                    })
                    .toFile(output)
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