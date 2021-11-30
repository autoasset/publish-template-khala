import IconConfig from "./config";
import FilePath from "./FilePath";
import FileIteratorNext from "./FileIteratorNext";
import Path from "path";
import * as fs from "fs/promises";

class FileIterator {

    config: IconConfig
    nexts: FileIteratorNext[]

    constructor(config: IconConfig, nexts: FileIteratorNext[]) {
        this.config = config
        this.nexts = nexts
    }

    async prepare() {
        /// 清理输出文件夹
        await this.delete(this.config.outputs.allPaths)
        await this.createDirs(this.config.outputs.allPaths)

        for (const next of this.nexts) {
            await next.prepare()
        }
    }

    async finish() {
        for (const next of this.nexts) {
            await next.finish()
        }
    }

    async run() {
        for (const path of this.config.inputs) {
            await this.forward(path)
        }
    }

    async scan(folder: string) {
        for (const path of await fs.readdir(folder)) {
            await this.forward(`${folder}${Path.sep}${path}`)
        }
    }

    async forward(path: string) {
        if (this.validate(path) == false) {
            return
        }

        const stat = await fs.stat(path)

        if (stat.isDirectory()) {
            await this.scan(path)
        } else if (stat.isFile()) {
            for (const next of this.nexts) {
                await next.add(path)
            }
        } else {
            console.log(`scan: ${path} 无法识别的文件类型`)
        }
    }

    validate(path: string): boolean {
        /// 排除隐藏文件/目录
        if (Path.basename(path).startsWith('.')) {
            return false
        }
        /// 是否在排除列表
        for (const exclude of this.config.exclude) {
            if (path.startsWith(exclude)) {
                return false
            }
        }
        return true
    }

    async createDirs(paths: string[]) {
        for (const folder of paths.filter(item => item)) {
            await FilePath.createFolder(FilePath.folder(folder))
        }
    }

    async delete(paths: string[]) {
        for (const folder of paths.filter(item => item)) {
            await FilePath.delete(folder)
        }
    }

}

export = FileIterator