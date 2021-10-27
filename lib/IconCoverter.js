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
const sharp_1 = __importDefault(require("sharp"));
const FilePath_1 = __importDefault(require("./FilePath"));
class IconCoverter {
    runInFolder(folder, svgCoverter) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const exclude of config_1.default.exclude) {
                if (folder.startsWith(exclude)) {
                    console.log("跳过路径: " + folder);
                    return;
                }
            }
            console.log("正在处理文件夹: " + folder);
            for (const item of yield fs.readdir(folder)) {
                if (item.startsWith('.')) {
                    continue;
                }
                const path = FilePath_1.default.path(folder, item);
                var isContinue = true;
                for (const exclude of config_1.default.exclude) {
                    if (path.startsWith(exclude)) {
                        console.log("跳过路径: " + path);
                        isContinue = false;
                        continue;
                    }
                }
                if (!isContinue) {
                    continue;
                }
                if ((yield fs.lstat(path)).isDirectory()) {
                    yield this.runInFolder(path, svgCoverter);
                }
                else {
                    try {
                        console.log("正在处理图片文件: " + path);
                        yield this.runForFile(path, item, svgCoverter);
                    }
                    catch (error) {
                        console.log("无法识别为图片的文件: " + path);
                    }
                }
            }
        });
    }
    runForFile(path, filename, svgCoverter) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = yield (0, sharp_1.default)(path).metadata();
            if (metadata.width == undefined) {
                return;
            }
            const outputs = config_1.default.outputs;
            if (metadata.format == 'gif') {
                yield (0, sharp_1.default)(path)
                    .resize(Math.round(metadata.width / 3 * 2))
                    .toFile(FilePath_1.default.path(outputs.gif2x, filename));
                fs.copyFile(path, FilePath_1.default.path(outputs.gif3x, filename));
            }
            else if (metadata.format == 'png' || metadata.format == 'jpg' || metadata.format == 'jpeg') {
                yield (0, sharp_1.default)(path)
                    .resize(Math.round(metadata.width / 3 * 2))
                    .toFile(FilePath_1.default.path(outputs.icon2x, filename));
                fs.copyFile(path, FilePath_1.default.path(outputs.icon3x, filename));
            }
            else if (metadata.format == 'svg') {
                fs.copyFile(path, FilePath_1.default.path(outputs.svg, filename));
                yield svgCoverter(path, filename);
            }
            else {
                fs.copyFile(path, FilePath_1.default.path(outputs.other, filename));
            }
        });
    }
    run(svgCoverter) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputs = config_1.default.outputs;
            const inputs = config_1.default.inputs;
            for (const folder of outputs.allPaths.filter(item => item)) {
                yield fs.rmdir(folder, { recursive: true });
                yield fs.mkdir(folder, { recursive: true });
            }
            for (const input of inputs) {
                yield this.runInFolder(input, svgCoverter);
            }
        });
    }
}
module.exports = new IconCoverter();
//# sourceMappingURL=IconCoverter.js.map