import FilePath from "../FilePath/FilePath";
import FileIteratorNext from "./FileIteratorNext";
import Path from "path";
import * as fs from "fs/promises";
import IconTask from "../Config/IconTask";
import Coverter from "../Config/Coverter";
import CoverterType from "../Config/CoverterType";
import CoverterOutputType from "../Config/CoverterOutputType";
import { ReportHelper } from "../ReportHelper";
import FilePathScanItemResult from '../FilePath/FilePathScanItemResult'

class FileIterator {

    task: IconTask

    private report: ReportHelper
    private coverters: Coverter[]
    private nexts: FileIteratorNext[]

    constructor(task: IconTask, nexts: FileIteratorNext[], report: ReportHelper) {
        this.task = task
        this.report = report
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
            await this.scan(path)
        }
    }

    async scan(folder: string) {
        const result = await FilePath.scan(folder)
        for (const file of result.files) {
            if (this.validateIgnore(file.full) == false) continue;
            if (this.validateFileByLints(file.name, file.full) == false) continue;
            await this.forwardFile(file)
        }

        for (const folder of result.folders) {
            if (this.validateIgnore(folder.full) == false) continue;
            await this.scan(folder.full)
        }
    }

    async forwardFile(file: FilePathScanItemResult) {
        console.log(`[khala] 开始处理 ${file.full}`)
        if (this.coverters.length == 0) {
            for (const next of this.nexts) {
                await next.add(file.full)
            }
            return
        } 

        for (const coverter of this.coverters) {
            if (coverter.output.file_excludes_same_name_with_different_suffixes) {
                const basename = FilePath.basename(file.name).name
                const result = await FilePath.scan(coverter.output.path)
                for (const file of result.files) {
                    if (FilePath.basename(file.name).name == basename) {
                        await FilePath.delete(file.full)
                    }
                }
            }
            await FilePath.copyToFolder(coverter.output.path, file.full)
        }
    }

    validateFileByLints(name: string, path: string): boolean {
        for (const lint of this.task.fileLints) {
            const reg = new RegExp(lint.pattern, 'g')
            if (reg.test(FilePath.basename(name).name) == false) {
                this.report.fileLintFail(path, lint)
                return false
            }
        }
        return true
    }

    validateIgnore(path: string): boolean {
        const basename = FilePath.basename(path)

        /// 排除隐藏文件/目录
        if (basename.full.startsWith('.')) {
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