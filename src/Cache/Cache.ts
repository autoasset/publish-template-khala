import path from 'path'
import { Md5 } from 'ts-md5'
import FilePath from '../FilePath/FilePath'
import os from 'os'

export = class Cache {

    basePath: string = `${os.homedir()}/.khala`

    path: string
    name: string

    constructor(name?: string) {
        this.name = name ?? 'cache/default'
        this.path = FilePath.filePath(this.basePath, this.name)
        FilePath.createFolder(this.path)
    }

    key(buffer: Buffer): string {
        const md5 = new Md5()
        md5.appendByteArray(buffer)
        const result = md5.end()
        if (typeof (result) == "string") {
            return result
        } else {
            return ""
        }
    }

    cacheFilePath(key: string, option: string): string {
        return FilePath.filePath(this.path, `${key}@${option}`)
    }

    async value(key: string, option: string): Promise<string | undefined> {
        const path = this.cacheFilePath(key, option)
        if (await FilePath.exists(path)) {
            return path
        }
        return undefined
    }

    async cache(buffer: Buffer | undefined, key: string, option: string) {
        if (buffer) {
            await FilePath.write(this.cacheFilePath(key, option), buffer)
        } else {
            await FilePath.delete(this.cacheFilePath(key, option))
        }
    }

    async useCache(buffer: Buffer, option: string, output: string, cacheFileBlock: (complete: () => void) => void) {
        await this.useCacheByKey(this.key(buffer), option, output, cacheFileBlock)
    }

    async useCacheByKey(key: string, option: string, output: string, cacheFileBlock: (complete: () => void) => void) {
        const cacheKey = key
        const newIcon = await this.value(cacheKey, option)
        if (newIcon) {
            const data = await FilePath.data(newIcon)
            if (data) {
                await FilePath.write(output, data)
            }
            return
        }
        cacheFileBlock(async () => {
            await this.cache(await FilePath.data(output), cacheKey, option)
        })
    }
}