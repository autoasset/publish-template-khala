"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
class FilePath {
    static rename(name, removePrefix, removeSubffix, addPrefix, addSubffix, extension) {
        var ext = extension;
        var filename = name;
        if (!extension) {
            const list = name.split(".");
            const paths = list[0].split('/');
            filename = paths[paths.length - 1];
            list.shift();
            ext = list.join(".");
        }
        if (removePrefix && filename.startsWith(removePrefix)) {
            filename = filename.slice(removePrefix.length);
        }
        if (removeSubffix && filename.endsWith(removeSubffix)) {
            filename = filename.slice(0, filename.length - removeSubffix.length - 1);
        }
        filename = addPrefix + filename + addSubffix;
        return [filename, ext].filter(item => item).join(".");
    }
    static filename(name, extension) {
        const index = name.indexOf('.');
        var list = [];
        if (index == -1) {
            list = [name, extension];
        }
        else {
            list = [name.substring(0, index), extension];
        }
        return list.filter(item => item).join(".");
    }
    static path(folder, filename) {
        var paths = folder.split('/');
        paths.push(filename);
        return path_1.default.resolve(paths.join('/'));
    }
}
module.exports = FilePath;
//# sourceMappingURL=FilePath.js.map