import config from "./config";
import * as fs from "fs/promises";
import FilePath from "./FilePath";
import path from "path/posix";

class ProductsCoverter {

    async run() {
        await this.iosBuild()
        await this.androidBuild()
        await this.flutterBuild()
    }

    async flutterBuild() {
        const flutter = config.products.flutter

        for (const folder of [flutter.iconfont].filter(item => item)) {
            await fs.rmdir(folder, { recursive: true })
            await fs.mkdir(folder, { recursive: true })
        }

        for (const filename of await fs.readdir(config.outputs.svg2iconfont)) {
            const path = FilePath.path(config.outputs.svg2iconfont, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            const targetPath = FilePath.path(flutter.iconfont, targetName)
            await fs.copyFile(path, targetPath)
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

        const android = config.products.android

        for (const folder of [android.x2, android.x3, android.vector_template].filter(item => item)) {
            await fs.rmdir(folder, { recursive: true })
            await fs.mkdir(folder, { recursive: true })
        }

        var copy_2x_Map = new Map<string, string>()
        var copy_3x_Map = new Map<string, string>()

        for (const folder of android.build_settings.copy_2x_inputs) {
            for (const filename of await fs.readdir(folder)) {
                if (!this.androidFilenameCheck(filename)) {
                    continue
                }
                var key = FilePath.filename(filename, "")
                const path = FilePath.path(folder, filename)
                copy_2x_Map.set(key, path)
                const targetName = FilePath.rename(filename, "", "", "", "", "")
                const targetPath = FilePath.path(android.x2, targetName)
                await fs.copyFile(path, targetPath)
            }
        }

        for (const folder of android.build_settings.copy_3x_inputs) {
            for (const filename of await fs.readdir(folder)) {
                if (!this.androidFilenameCheck(filename)) {
                    continue
                }
                var key = FilePath.filename(filename, "")
                const path = FilePath.path(folder, filename)
                copy_3x_Map.set(key, path)
                const targetName = FilePath.rename(filename, "", "", "", "", "")
                const targetPath = FilePath.path(android.x3, targetName)
                await fs.copyFile(path, targetPath)
            }
        }

        for (const filename of await fs.readdir(config.outputs.gif2x)) {
            if (copy_2x_Map.get(FilePath.filename(filename, ""))) {
                continue
            }
            if (!this.androidFilenameCheck(filename)) {
                continue
            }
            const path = FilePath.path(config.outputs.gif2x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            const targetPath = FilePath.path(android.x2, targetName)
            await fs.copyFile(path, targetPath)
        }

        for (const filename of await fs.readdir(config.outputs.gif3x)) {
            if (copy_3x_Map.get(FilePath.filename(filename, ""))) {
                continue
            }
            if (!this.androidFilenameCheck(filename)) {
                continue
            }
            const path = FilePath.path(config.outputs.gif3x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            const targetPath = FilePath.path(android.x3, targetName)
            await fs.copyFile(path, targetPath)
        }

        for (const filename of await fs.readdir(config.outputs.icon2x)) {
            if (copy_2x_Map.get(FilePath.filename(filename, ""))) {
                continue
            }
            if (!this.androidFilenameCheck(filename)) {
                continue
            }
            const path = FilePath.path(config.outputs.icon2x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            const targetPath = FilePath.path(android.x2, targetName)
            await fs.copyFile(path, targetPath)
        }

        for (const filename of await fs.readdir(config.outputs.icon3x)) {
            if (copy_3x_Map.get(FilePath.filename(filename, ""))) {
                continue
            }
            if (!this.androidFilenameCheck(filename)) {
                continue
            }
            const path = FilePath.path(config.outputs.icon3x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            const targetPath = FilePath.path(android.x3, targetName)
            await fs.copyFile(path, targetPath)
        }

        for (const filename of await fs.readdir(config.outputs.svg2xml)) {
            if (!this.androidFilenameCheck(filename)) {
                continue
            }
            const path = FilePath.path(config.outputs.svg2xml, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            const targetPath = FilePath.path(android.vector_template, targetName)
            await fs.copyFile(path, targetPath)
        }
    }

    async iosBuild() {
        const ios = config.products.ios

        for (const folder of [ios.gif, ios.icon, ios.vector_template, ios.iconfont].filter(item => item)) {
            await fs.rmdir(folder, { recursive: true })
            await fs.mkdir(folder, { recursive: true })
        }

        for (const filename of await fs.readdir(config.outputs.svg2custom_iconfont)) {
            const path = FilePath.path(config.outputs.svg2custom_iconfont, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            const targetPath = FilePath.path(ios.iconfont, targetName)
            await fs.copyFile(path, targetPath)
        }

        for (const filename of await fs.readdir(config.outputs.gif3x)) {
            const path = FilePath.path(config.outputs.gif3x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            const targetPath = FilePath.path(ios.gif, targetName)
            await fs.copyFile(path, targetPath)
        }

        for (const filename of await fs.readdir(config.outputs.icon2x)) {
            const path = FilePath.path(config.outputs.icon2x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "@2x", "")
            const targetPath = FilePath.path(ios.icon, targetName)
            await fs.copyFile(path, targetPath)
        }

        for (const filename of await fs.readdir(config.outputs.icon3x)) {
            const path = FilePath.path(config.outputs.icon3x, filename);
            const targetName = FilePath.rename(filename, "", "", "", "@3x", "")
            const targetPath = FilePath.path(ios.icon, targetName)
            await fs.copyFile(path, targetPath)
        }

        for (const filename of await fs.readdir(config.outputs.svg2pdf)) {
            const path = FilePath.path(config.outputs.svg2pdf, filename);
            const targetName = FilePath.rename(filename, "", "", "", "", "")
            const targetPath = FilePath.path(ios.vector_template, targetName)
            await fs.copyFile(path, targetPath)
        }
    }

}

export = new ProductsCoverter()