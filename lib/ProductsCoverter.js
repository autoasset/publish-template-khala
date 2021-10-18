"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const config_1 = __importDefault(require("./config"));
const fs = __importStar(require("fs/promises"));
const FilePath_1 = __importDefault(require("./FilePath"));
class ProductsCoverter {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.iosBuild();
            yield this.androidBuild();
            yield this.flutterBuild();
        });
    }
    flutterBuild() {
        return __awaiter(this, void 0, void 0, function* () {
            const flutter = config_1.default.products.flutter;
            for (const folder of [flutter.iconfont].filter(item => item)) {
                yield fs.rmdir(folder, { recursive: true });
                yield fs.mkdir(folder, { recursive: true });
            }
            for (const filename of yield fs.readdir(config_1.default.outputs.svg2iconfont)) {
                const path = FilePath_1.default.path(config_1.default.outputs.svg2iconfont, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                const targetPath = FilePath_1.default.path(flutter.iconfont, targetName);
                yield fs.copyFile(path, targetPath);
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
            const android = config_1.default.products.android;
            for (const folder of [android.x2, android.x3, android.vector_template].filter(item => item)) {
                yield fs.rmdir(folder, { recursive: true });
                yield fs.mkdir(folder, { recursive: true });
            }
            var copy_2x_Map = new Map();
            var copy_3x_Map = new Map();
            for (const folder of android.build_settings.copy_2x_inputs) {
                for (const filename of yield fs.readdir(folder)) {
                    if (!this.androidFilenameCheck(filename)) {
                        continue;
                    }
                    var key = FilePath_1.default.filename(filename, "");
                    const path = FilePath_1.default.path(folder, filename);
                    copy_2x_Map.set(key, path);
                    const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                    const targetPath = FilePath_1.default.path(android.x2, targetName);
                    yield fs.copyFile(path, targetPath);
                }
            }
            for (const folder of android.build_settings.copy_3x_inputs) {
                for (const filename of yield fs.readdir(folder)) {
                    if (!this.androidFilenameCheck(filename)) {
                        continue;
                    }
                    var key = FilePath_1.default.filename(filename, "");
                    const path = FilePath_1.default.path(folder, filename);
                    copy_3x_Map.set(key, path);
                    const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                    const targetPath = FilePath_1.default.path(android.x3, targetName);
                    yield fs.copyFile(path, targetPath);
                }
            }
            for (const filename of yield fs.readdir(config_1.default.outputs.gif2x)) {
                if (copy_2x_Map.get(FilePath_1.default.filename(filename, ""))) {
                    continue;
                }
                if (!this.androidFilenameCheck(filename)) {
                    continue;
                }
                const path = FilePath_1.default.path(config_1.default.outputs.gif2x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                const targetPath = FilePath_1.default.path(android.x2, targetName);
                yield fs.copyFile(path, targetPath);
            }
            for (const filename of yield fs.readdir(config_1.default.outputs.gif3x)) {
                if (copy_3x_Map.get(FilePath_1.default.filename(filename, ""))) {
                    continue;
                }
                if (!this.androidFilenameCheck(filename)) {
                    continue;
                }
                const path = FilePath_1.default.path(config_1.default.outputs.gif3x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                const targetPath = FilePath_1.default.path(android.x3, targetName);
                yield fs.copyFile(path, targetPath);
            }
            for (const filename of yield fs.readdir(config_1.default.outputs.icon2x)) {
                if (copy_2x_Map.get(FilePath_1.default.filename(filename, ""))) {
                    continue;
                }
                if (!this.androidFilenameCheck(filename)) {
                    continue;
                }
                const path = FilePath_1.default.path(config_1.default.outputs.icon2x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                const targetPath = FilePath_1.default.path(android.x2, targetName);
                yield fs.copyFile(path, targetPath);
            }
            for (const filename of yield fs.readdir(config_1.default.outputs.icon3x)) {
                if (copy_3x_Map.get(FilePath_1.default.filename(filename, ""))) {
                    continue;
                }
                if (!this.androidFilenameCheck(filename)) {
                    continue;
                }
                const path = FilePath_1.default.path(config_1.default.outputs.icon3x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                const targetPath = FilePath_1.default.path(android.x3, targetName);
                yield fs.copyFile(path, targetPath);
            }
            for (const filename of yield fs.readdir(config_1.default.outputs.svg2xml)) {
                if (!this.androidFilenameCheck(filename)) {
                    continue;
                }
                const path = FilePath_1.default.path(config_1.default.outputs.svg2xml, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                const targetPath = FilePath_1.default.path(android.vector_template, targetName);
                yield fs.copyFile(path, targetPath);
            }
        });
    }
    iosBuild() {
        return __awaiter(this, void 0, void 0, function* () {
            const ios = config_1.default.products.ios;
            for (const folder of [ios.gif, ios.icon, ios.vector_template, ios.iconfont].filter(item => item)) {
                yield fs.rmdir(folder, { recursive: true });
                yield fs.mkdir(folder, { recursive: true });
            }
            for (const filename of yield fs.readdir(config_1.default.outputs.svg2custom_iconfont)) {
                const path = FilePath_1.default.path(config_1.default.outputs.svg2custom_iconfont, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                const targetPath = FilePath_1.default.path(ios.iconfont, targetName);
                yield fs.copyFile(path, targetPath);
            }
            for (const filename of yield fs.readdir(config_1.default.outputs.gif3x)) {
                const path = FilePath_1.default.path(config_1.default.outputs.gif3x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                const targetPath = FilePath_1.default.path(ios.gif, targetName);
                yield fs.copyFile(path, targetPath);
            }
            for (const filename of yield fs.readdir(config_1.default.outputs.icon2x)) {
                const path = FilePath_1.default.path(config_1.default.outputs.icon2x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "@2x", "");
                const targetPath = FilePath_1.default.path(ios.icon, targetName);
                yield fs.copyFile(path, targetPath);
            }
            for (const filename of yield fs.readdir(config_1.default.outputs.icon3x)) {
                const path = FilePath_1.default.path(config_1.default.outputs.icon3x, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "@3x", "");
                const targetPath = FilePath_1.default.path(ios.icon, targetName);
                yield fs.copyFile(path, targetPath);
            }
            for (const filename of yield fs.readdir(config_1.default.outputs.svg2pdf)) {
                const path = FilePath_1.default.path(config_1.default.outputs.svg2pdf, filename);
                const targetName = FilePath_1.default.rename(filename, "", "", "", "", "");
                const targetPath = FilePath_1.default.path(ios.vector_template, targetName);
                yield fs.copyFile(path, targetPath);
            }
        });
    }
}
module.exports = new ProductsCoverter();
//# sourceMappingURL=ProductsCoverter.js.map