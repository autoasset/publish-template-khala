import config from "./config";
import * as fs from "fs/promises";
import sharp from 'sharp';
import FilePath from "./FilePath";

class IconCoverter {

    async runInFolder(folder: string, svgCoverter: (file: string, filename: string) => void) {

        for (const exclude of config.exclude) {
            if (folder.startsWith(exclude)) {
                console.log("跳过路径: " + folder)
                return
            }
        }

        console.log("正在处理文件夹: " + folder.replace(process.cwd(),''))
        for (const item of await fs.readdir(folder)) {
            if (item.startsWith('.')) {
                continue
            }

            const path = FilePath.path(folder, item);

            var isContinue = true
            for (const exclude of config.exclude) {
                if (path.startsWith(exclude)) {
                    console.log("跳过路径: " + path)
                    isContinue = false
                    continue
                }
            }

            if (!isContinue) {
                continue
            }

            if ((await fs.lstat(path)).isDirectory()) {
                await this.runInFolder(path, svgCoverter)
            } else {
                try {
                    console.log("正在处理图片文件: " + path.replace(process.cwd(),''))
                    await this.runForFile(path, item, svgCoverter)
                } catch (error) {
                    console.log("无法识别为图片的文件: " + path.replace(process.cwd(),''))
                }
            }
        }
    }

    async runForFile(path: string, filename: string, svgCoverter: (file: string, filename: string) => void) {
        const metadata = await sharp(path).metadata()
        if (metadata.width == undefined) {
            return
        }
        const outputs = config.outputs
        if (metadata.format == 'gif') {
            await sharp(path)
                .resize(Math.round(metadata.width / 3 * 2))
                .toFile(FilePath.path(outputs.gif2x, filename))
            fs.copyFile(path, FilePath.path(outputs.gif3x, filename))
        } else if (metadata.format == 'png' || metadata.format == 'jpg' || metadata.format == 'jpeg') {
            await sharp(path)
                .resize(Math.round(metadata.width / 3 * 2))
                .toFile(FilePath.path(outputs.icon2x, filename))
            fs.copyFile(path, FilePath.path(outputs.icon3x, filename))
        } else if (metadata.format == 'svg') {
            await svgCoverter(path, filename)
        } else {
            fs.copyFile(path, FilePath.path(outputs.other, filename))
        }
    }

    async run(svgCoverter: (file: string, filename: string) => void) {
        const outputs = config.outputs
        const inputs = config.inputs

        for (const folder of outputs.allPaths.filter(item => item)) {
            await fs.rmdir(folder, { recursive: true })
            await fs.mkdir(folder, { recursive: true })
        }

        for (const input of inputs) {
            await this.runInFolder(input, svgCoverter)
        }

    }

}

export = new IconCoverter();