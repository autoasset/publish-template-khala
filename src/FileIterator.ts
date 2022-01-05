import FilePath from "./FilePath";
import FileIteratorNext from "./FileIteratorNext";
import Path from "path";
import * as fs from "fs/promises";
import IconTask from "./Config/IconTask";
import Coverter from "./Config/Coverter";
import CoverterType from "./Config/CoverterType";
import CoverterOutputType from "./Config/CoverterOutputType";

class FileIterator {

    task: IconTask
    coverters: Coverter[]
    nexts: FileIteratorNext[]

    constructor(task: IconTask, nexts: FileIteratorNext[]) {
        this.task = task
        this.nexts = nexts
        this.coverters = task.coverters.filter((item) => {
           return item.type == CoverterType.file && item.output.type == CoverterOutputType.file
        })
    }

    async prepare() {
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
        for (const path of this.task.inputs) {
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
            if (this.coverters.length > 0) {
                for (const coverter of this.coverters) {
                    await FilePath.copyToFolder(coverter.output.path, path)
                }
            } else {
                for (const next of this.nexts) {
                    await next.add(path)
                }
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
        for (const exclude of this.task.ignore) {
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