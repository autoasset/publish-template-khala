import FileIteratorNext from "./FileIteratorNext";
import sharp from 'sharp';
import IconConfig from "./config";
import FilePath from "./FilePath";
import SVGFileIteratorNext from "./SVGFileIteratorNext";

class IconIterator implements FileIteratorNext {

    config: IconConfig
    nexts: SVGFileIteratorNext[]

    constructor(config: IconConfig, nexts: SVGFileIteratorNext[]) {
        this.config = config
        this.nexts = nexts
    }

    async prepare() {
        await FilePath.createFolder(this.config.outputs.gif3x)
        await FilePath.createFolder(this.config.outputs.gif2x)
        await FilePath.createFolder(this.config.outputs.icon3x)
        await FilePath.createFolder(this.config.outputs.icon2x)
        for (const next of this.nexts) {
            await next.prepare()
        }
    }

    async add(path: string) {
        const file = sharp(path, { animated: true })
        const metadata = await file.metadata()

        if (metadata.format == 'gif') {
            this.dealImage3x(file, path, metadata, this.config.outputs.gif3x)
            this.dealImage3x(file, path, metadata, this.config.outputs.gif2x)
            return
        }

        if (metadata.format == 'png' || metadata.format == 'jpg' || metadata.format == 'jpeg') {
            this.dealImage3x(file, path, metadata, this.config.outputs.icon3x)
            this.dealImage2x(file, path, metadata, this.config.outputs.icon2x)
            return
        }

        if (metadata.format == 'svg') {
            for (const next of this.nexts) {
                await next.add(path)
            }
            return
        }

        FilePath.copyToFolder(this.config.outputs.other, FilePath.basename(path))
    }

    async dealImage3x(file: sharp.Sharp, path: string, metadata: sharp.Metadata, folder: string) {
        FilePath.copyToFolder(folder, path)
    }

    async dealImage2x(file: sharp.Sharp, path: string, metadata: sharp.Metadata, folder: string) {
        if (metadata.width == undefined) {
            return
        }

        if (metadata.height == undefined) {
            return
        }

        const output = FilePath.filePath(folder, FilePath.basename(path))

        await file
            .resize({
                width: Math.round(metadata.width / 3 * 2),
                height: Math.round(metadata.height / 3 * 2)
            })
            .toFile(output)
    }

    async finish() {
        for (const next of this.nexts) {
            await next.finish()
        }
    }

}

export = IconIterator