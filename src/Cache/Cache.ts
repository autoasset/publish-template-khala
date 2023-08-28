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

    async tryGet(key: string, option: string, bufferBuilder: () => Promise<Buffer>): Promise<Buffer> {
        var buffer = await this.get(key, option)
        if (buffer) {
            return buffer
        } else {
            buffer = await bufferBuilder()
            await this.set(buffer, key, option)
            return buffer
        }
    }

    async set(buffer: Buffer | undefined, key: string, option: string) {
        if (buffer) {
            await FilePath.write(this.mixedKey(key, option), buffer)
        } else {
            await FilePath.delete(this.mixedKey(key, option))
        }
    }

     async get(key: string, option: string): Promise<Buffer | undefined> {
        return await FilePath.data(this.mixedKey(key, option))
     }

    async useCache(buffer: Buffer, option: string, output: string, cacheFileBlock: () => Promise<void>) {
        await this.useCacheByKey(this.key(buffer), option, output, cacheFileBlock)
    }

    async useCacheByKey(key: string, option: string, output: string, cacheFileBlock: () => Promise<void>) {
        const mixedKey = this.mixedKey(key, option)
        const buffer = await FilePath.data(mixedKey)
        if (buffer) {
            await FilePath.write(output, buffer)
            return
        }
       await cacheFileBlock()
       await this.set(await FilePath.data(output), mixedKey, option)
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

     mixedKey(key: string, option: string): string {
        return FilePath.filePath(this.path, `${key}@${option}`)
    }

}