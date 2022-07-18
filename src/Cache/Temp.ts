import FilePath from '../FilePath/FilePath'
import os from 'os'
import { randomUUID } from 'crypto'

export = class Temp {

    private static ID = randomUUID()
    private static folder = `${os.homedir()}/.khala/temp/${Temp.ID}`

    path = `${Temp.folder}/${randomUUID()}`

    async file(name: string): Promise<string> {
        await FilePath.createFolder(this.path)
        return FilePath.filePath(this.path, name)
    }

    // 移除 temp 文件夹
    async delete() {
        await FilePath.delete(this.path)
    }

    // 移除 temp 文件夹
    static async deleteAll() {
        await FilePath.delete(this.folder)
    }

}