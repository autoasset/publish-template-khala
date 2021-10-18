import path from "path";

class FilePath {

    static rename(name: string,
        removePrefix: string,
        removeSubffix: string,
        addPrefix: string,
        addSubffix: string,
        extension?: string): string {

        var ext = extension
        var filename: string = name

        if (!extension) {
            const list = name.split(".")
            const paths = list[0].split('/')
            filename = paths[paths.length - 1]

            list.shift()
            ext = list.join(".")
        }

        if (removePrefix && filename.startsWith(removePrefix)) {
            filename = filename.slice(removePrefix.length);
        }

        if (removeSubffix && filename.endsWith(removeSubffix)) {
            filename = filename.slice(0, filename.length - removeSubffix.length - 1);
        }

        filename = addPrefix + filename + addSubffix

        return [filename, ext].filter(item => item).join(".")
    }

    static filename(name: string, extension: string): string {
        const index = name.indexOf('.')
        var list: string[] = []
        if (index == -1) {
            list = [name, extension]
        } else {
            list = [name.substring(0, index), extension]
        }
        return list.filter(item => item).join(".")
    }

    static path(folder: string, filename: string): string {
        var paths = folder.split('/')
        paths.push(filename)
        return path.resolve(paths.join('/'))
    }

}



export = FilePath