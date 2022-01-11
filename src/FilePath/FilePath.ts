import fs from "fs/promises";
import Path from "path";
import FilePathScanResult from "./FilePathScanResult";
import FilePathScanItemResult from './FilePathScanItemResult'

export = class FilePath {

    static filename(name: string, extension: string): string {
        const basename = this.basename(name)
        return [basename.name, extension].filter(item => item).join(".")
    }

    static filePath(folder: string, filename: string): string {
        var paths = folder.split(Path.sep)
        paths.push(filename)
        return Path.resolve(paths.join(Path.sep))
    }

    static basename(path: string): { name: string, ext: string, full: string } {
        const full = Path.basename(path)
        var ext = ""

        const index = full.indexOf('.')
        if (index == -1) {
            return { name: full, ext: ext, full: full }
        } else {
            return { name: full.substring(0, index), ext: full.substring(index+1, full.length), full: full }
        }
    }

    static async scan(input: string): Promise<FilePathScanResult> {
        var result = new FilePathScanResult()
        const stat = await fs.stat(input)
        if (stat.isFile()) {
            result.files.push(new FilePathScanItemResult(this.basename(input).name, input))
            return result
        } else if (stat.isDirectory()) {
            for (const name of await fs.readdir(input)) {
                const fullPath = `${input}${Path.sep}${name}`
                const stat = await fs.stat(fullPath)
                if (stat.isFile()) {
                    result.files.push(new FilePathScanItemResult(name, fullPath))
                } else if (stat.isDirectory()) {
                    result.folders.push(new FilePathScanItemResult(name, fullPath))
                } else {
                    console.log(`[khala]: 无法识别的文件类型 ${fullPath}`)
                }
            }
        } else {
            console.log(`[khala]: 无法识别的文件类型 ${input}`)
        }
        return result
    }

    static async copyToFolder(folder: string, path: string, rename?: string) {
        await this.createFolder(folder)
        const filename = rename ?? Path.basename(path)
        const dest = this.filePath(folder, filename)
        await this.createFolder(this.folder(dest))
        await this.copyFile(path, dest)
     }

     static async copyFile(src: string, dest: string, mode?: number) {
        fs.copyFile(src, dest, mode)

     }

    static async delete(path: string) {
        try {
            await fs.rm(path, { recursive: true })
        } catch (error) {
        
        }
    }

    static folder(path: string): string {
        return Path.resolve(Path.dirname(path))
    }

    static async write(path: string, data: string | NodeJS.ArrayBufferView) {
        await this.createFolder(FilePath.folder(path))
        await fs.writeFile(path, data)
    }

    static async createFolder(path: string) {
        try {
            await fs.access(path)
        } catch (error) {    
            try {
               await fs.mkdir(path, { recursive: true })
            } catch (error) {
                
            }   
        }
    }

}