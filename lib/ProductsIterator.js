"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const promises_1 = __importDefault(require("fs/promises"));
const FilePath_1 = __importDefault(require("./FilePath"));
class ProductsIterator {
    constructor(config) {
        this.config = config;
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            yield FilePath_1.default.createFolder(this.config.products.ios.icon);
            yield FilePath_1.default.createFolder(this.config.products.ios.gif);
            yield FilePath_1.default.createFolder(this.config.products.ios.iconfont);
            yield FilePath_1.default.createFolder(this.config.products.android.vector_template);
            yield FilePath_1.default.createFolder(this.config.products.android.x2);
            yield FilePath_1.default.createFolder(this.config.products.android.x3);
            yield FilePath_1.default.createFolder(this.config.products.flutter.iconfont);
        });
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.iosBuild();
            yield this.androidBuild();
            yield this.flutterBuild();
        });
    }
    flutterBuild() {
        return __awaiter(this, void 0, void 0, function* () {
            const flutter = this.config.products.flutter;
            for (const folder of [flutter.iconfont].filter(item => item)) {
                yield FilePath_1.default.delete(folder);
                yield FilePath_1.default.createFolder(folder);
            }
            for (const filename of yield promises_1.default.readdir(this.config.outputs.svg2iconfont)) {
                const path = FilePath_1.default.filePath(this.config.outputs.svg2iconfont, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                yield FilePath_1.default.copyToFolder(flutter.iconfont, path, targetName);
            }
        });
    }
    // https://stackoverflow.com/questions/41011739/error-the-file-name-must-end-with-xml-or-png
    androidFilenameCheck(filename) {
        if (filename.endsWith(".xml")) {
            return true;
        }
        if (filename.endsWith(".jpg")) {
            return true;
        }
        if (filename.endsWith(".gif")) {
            return true;
        }
        if (filename.endsWith(".png")) {
            return true;
        }
        console.log("安卓资源文件名后缀只能为xml/png, file: " + filename);
        return false;
    }
    androidBuild() {
        return __awaiter(this, void 0, void 0, function* () {
            const android = this.config.products.android;
            for (const folder of [android.x2, android.x3, android.vector_template].filter(item => item)) {
                yield FilePath_1.default.delete(folder);
                yield FilePath_1.default.createFolder(folder);
            }
            var copy_2x_Map = new Map();
            var copy_3x_Map = new Map();
            for (const folder of android.build_settings.copy_2x_inputs) {
                for (const filename of yield promises_1.default.readdir(folder)) {
                    if (!this.androidFilenameCheck(filename)) {
                        continue;
                    }
                    var key = FilePath_1.default.filename(filename, "");
                    const path = FilePath_1.default.filePath(folder, filename);
                    copy_2x_Map.set(key, path);
                    const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                    yield FilePath_1.default.copyToFolder(android.x2, path, targetName);
                }
            }
            for (const folder of android.build_settings.copy_3x_inputs) {
                for (const filename of yield promises_1.default.readdir(folder)) {
                    if (!this.androidFilenameCheck(filename)) {
                        continue;
                    }
                    var key = FilePath_1.default.filename(filename, "");
                    const path = FilePath_1.default.filePath(folder, filename);
                    copy_3x_Map.set(key, path);
                    const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                    yield FilePath_1.default.copyToFolder(android.x3, path, targetName);
                }
            }
            for (const filename of yield promises_1.default.readdir(this.config.outputs.gif2x)) {
                if (copy_2x_Map.get(FilePath_1.default.filename(filename, ""))) {
                    continue;
                }
                if (!this.androidFilenameCheck(filename)) {
                    continue;
                }
                const path = FilePath_1.default.filePath(this.config.outputs.gif2x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                yield FilePath_1.default.copyToFolder(android.x2, path, targetName);
            }
            for (const filename of yield promises_1.default.readdir(this.config.outputs.gif3x)) {
                if (copy_3x_Map.get(FilePath_1.default.filename(filename, ""))) {
                    continue;
                }
                if (!this.androidFilenameCheck(filename)) {
                    continue;
                }
                const path = FilePath_1.default.filePath(this.config.outputs.gif3x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                yield FilePath_1.default.copyToFolder(android.x3, path, targetName);
            }
            for (const filename of yield promises_1.default.readdir(this.config.outputs.icon2x)) {
                if (copy_2x_Map.get(FilePath_1.default.filename(filename, ""))) {
                    continue;
                }
                if (!this.androidFilenameCheck(filename)) {
                    continue;
                }
                const path = FilePath_1.default.filePath(this.config.outputs.icon2x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                const targetPath = FilePath_1.default.filePath(android.x2, targetName);
                yield FilePath_1.default.copyToFolder(android.x2, path, targetName);
            }
            for (const filename of yield promises_1.default.readdir(this.config.outputs.icon3x)) {
                if (copy_3x_Map.get(FilePath_1.default.filename(filename, ""))) {
                    continue;
                }
                if (!this.androidFilenameCheck(filename)) {
                    continue;
                }
                const path = FilePath_1.default.filePath(this.config.outputs.icon3x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                yield FilePath_1.default.copyToFolder(android.x3, path, targetName);
            }
            for (const filename of yield promises_1.default.readdir(this.config.outputs.svg2xml)) {
                if (!this.androidFilenameCheck(filename)) {
                    continue;
                }
                const path = FilePath_1.default.filePath(this.config.outputs.svg2xml, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                yield FilePath_1.default.copyToFolder(android.vector_template, path, targetName);
            }
        });
    }
    iosBuild() {
        return __awaiter(this, void 0, void 0, function* () {
            const ios = this.config.products.ios;
            for (const folder of [ios.gif, ios.icon, ios.vector_template, ios.iconfont].filter(item => item)) {
                yield FilePath_1.default.delete(folder);
                yield FilePath_1.default.createFolder(folder);
            }
            for (const filename of yield promises_1.default.readdir(this.config.outputs.svg2custom_iconfont)) {
                const path = FilePath_1.default.filePath(this.config.outputs.svg2custom_iconfont, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                yield FilePath_1.default.copyToFolder(ios.iconfont, path, targetName);
            }
            for (const filename of yield promises_1.default.readdir(this.config.outputs.gif3x)) {
                const path = FilePath_1.default.filePath(this.config.outputs.gif3x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                yield FilePath_1.default.copyToFolder(ios.gif, path, targetName);
            }
            for (const filename of yield promises_1.default.readdir(this.config.outputs.icon2x)) {
                const path = FilePath_1.default.filePath(this.config.outputs.icon2x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "@2x", "");
                yield FilePath_1.default.copyToFolder(ios.icon, path, targetName);
            }
            for (const filename of yield promises_1.default.readdir(this.config.outputs.icon3x)) {
                const path = FilePath_1.default.filePath(this.config.outputs.icon3x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "@3x", "");
                yield FilePath_1.default.copyToFolder(ios.icon, path, targetName);
            }
            for (const filename of yield promises_1.default.readdir(this.config.outputs.svg2pdf)) {
                const path = FilePath_1.default.filePath(this.config.outputs.svg2pdf, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                yield FilePath_1.default.copyToFolder(ios.vector_template, path, targetName);
            }
        });
    }
}
module.exports = ProductsIterator;
//# sourceMappingURL=ProductsIterator.js.map