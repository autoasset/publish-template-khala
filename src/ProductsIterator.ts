import IconConfig from "./config";
import fs from "fs/promises";
import FilePath from "./FilePath";

class ProductsIterator {

    config: IconConfig

    constructor(config: IconConfig) {
        this.config = config
    }

    public async prepare() {
        await FilePath.createFolder(this.config.products.ios.icon)
        await FilePath.createFolder(this.config.products.ios.gif)
        await FilePath.createFolder(this.config.products.ios.iconfont)

        await FilePath.createFolder(this.config.products.android.vector_template)
        await FilePath.createFolder(this.config.products.android.x2)
        await FilePath.createFolder(this.config.products.android.x3)

        await FilePath.createFolder(this.config.products.flutter.iconfont)
    }

    async finish() {

    }
    
    async run() {
        await this.iosBuild()
        await this.androidBuild()
        await this.flutterBuild()
    }

    async flutterBuild() {
        const flutter = this.config.products.flutter

        for (const folder of [flutter.iconfont].filter(item => item)) {
            await FilePath.delete(folder)
            await FilePath.createFolder(folder)
        }

        for (const filename of await fs.readdir(this.config.outputs.svg2iconfont)) {
            const path = FilePath.filePath(this.config.outputs.svg2iconfont, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            await FilePath.copyToFolder(flutter.iconfont, path, targetName)
        }
    }

    // https://stackoverflow.com/questions/41011739/error-the-file-name-must-end-with-xml-or-png
    androidFilenameCheck(filename: string): boolean {
        if (filename.endsWith(".xml")) {
            return true
        }
        if (filename.endsWith(".jpg")) {
            return true
        }
        if (filename.endsWith(".gif")) {
            return true
        }
        if (filename.endsWith(".png")) {
            return true
        }
        console.log("安卓资源文件名后缀只能为xml/png, file: " + filename)
        return false
    }

    async androidBuild() {

        const android = this.config.products.android

        for (const folder of [android.x2, android.x3, android.vector_template].filter(item => item)) {
            await FilePath.delete(folder)
            await FilePath.createFolder(folder)
        }

        var copy_2x_Map = new Map<string, string>()
        var copy_3x_Map = new Map<string, string>()

        for (const folder of android.build_settings.copy_2x_inputs) {
            for (const filename of await fs.readdir(folder)) {
                if (!this.androidFilenameCheck(filename)) {
                    continue
                }
                var key = FilePath.filename(filename, "")
                const path = FilePath.filePath(folder, filename)
                copy_2x_Map.set(key, path)
                const targetName = FilePath.rename(filename, "", "", "", "", "")
                await FilePath.copyToFolder(android.x2, path, targetName)
            }
        }

        for (const folder of android.build_settings.copy_3x_inputs) {
            for (const filename of await fs.readdir(folder)) {
                if (!this.androidFilenameCheck(filename)) {
                    continue
                }
                var key = FilePath.filename(filename, "")
                const path = FilePath.filePath(folder, filename)
                copy_3x_Map.set(key, path)
                const targetName = FilePath.rename(filename, "", "", "", "", "")
                await FilePath.copyToFolder(android.x3, path, targetName)
            }
        }

        for (const filename of await fs.readdir(this.config.outputs.gif2x)) {
            if (copy_2x_Map.get(FilePath.filename(filename, ""))) {
                continue
            }
            if (!this.androidFilenameCheck(filename)) {
                continue
            }
            const path = FilePath.filePath(this.config.outputs.gif2x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            await FilePath.copyToFolder(android.x2, path, targetName)
        }

        for (const filename of await fs.readdir(this.config.outputs.gif3x)) {
            if (copy_3x_Map.get(FilePath.filename(filename, ""))) {
                continue
            }
            if (!this.androidFilenameCheck(filename)) {
                continue
            }
            const path = FilePath.filePath(this.config.outputs.gif3x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            await FilePath.copyToFolder(android.x3, path, targetName)
        }

        for (const filename of await fs.readdir(this.config.outputs.icon2x)) {
            if (copy_2x_Map.get(FilePath.filename(filename, ""))) {
                continue
            }
            if (!this.androidFilenameCheck(filename)) {
                continue
            }
            const path = FilePath.filePath(this.config.outputs.icon2x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            const targetPath = FilePath.filePath(android.x2, targetName)
            await FilePath.copyToFolder(android.x2, path, targetName)
        }

        for (const filename of await fs.readdir(this.config.outputs.icon3x)) {
            if (copy_3x_Map.get(FilePath.filename(filename, ""))) {
                continue
            }
            if (!this.androidFilenameCheck(filename)) {
                continue
            }
            const path = FilePath.filePath(this.config.outputs.icon3x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            await FilePath.copyToFolder(android.x3, path, targetName)
        }

        for (const filename of await fs.readdir(this.config.outputs.svg2xml)) {
            if (!this.androidFilenameCheck(filename)) {
                continue
            }
            const path = FilePath.filePath(this.config.outputs.svg2xml, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            await FilePath.copyToFolder(android.vector_template, path, targetName)
        }
    }

    async iosBuild() {
        const ios = this.config.products.ios

        for (const folder of [ios.gif, ios.icon, ios.vector_template, ios.iconfont].filter(item => item)) {
            await FilePath.delete(folder)
            await FilePath.createFolder(folder)
        }

        for (const filename of await fs.readdir(this.config.outputs.svg2custom_iconfont)) {
            const path = FilePath.filePath(this.config.outputs.svg2custom_iconfont, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            await FilePath.copyToFolder(ios.iconfont, path, targetName)
        }

        for (const filename of await fs.readdir(this.config.outputs.gif3x)) {
            const path = FilePath.filePath(this.config.outputs.gif3x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            await FilePath.copyToFolder(ios.gif, path, targetName)
        }

        for (const filename of await fs.readdir(this.config.outputs.icon2x)) {
            const path = FilePath.filePath(this.config.outputs.icon2x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "@2x", "")
            await FilePath.copyToFolder(ios.icon, path, targetName)
        }

        for (const filename of await fs.readdir(this.config.outputs.icon3x)) {
            const path = FilePath.filePath(this.config.outputs.icon3x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "@3x", "")
            await FilePath.copyToFolder(ios.icon, path, targetName)
        }

        for (const filename of await fs.readdir(this.config.outputs.svg2pdf)) {
            const path = FilePath.filePath(this.config.outputs.svg2pdf, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            await FilePath.copyToFolder(ios.vector_template, path, targetName)
        }
    }

}

export = ProductsIterator