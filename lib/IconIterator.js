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
const sharp_1 = __importDefault(require("sharp"));
const FilePath_1 = __importDefault(require("./FilePath"));
const CoverterType_1 = __importDefault(require("./Config/CoverterType"));
class IconIterator {
    constructor(coverters, nexts) {
        this.coverters = {};
        coverters.filter((item) => {
            return item.type == CoverterType_1.default.icon || item.type == CoverterType_1.default.gif;
        }).forEach((item) => {
            if (!this.coverters[item.type.rawValue]) {
                this.coverters[item.type.rawValue] = [];
            }
            this.coverters[item.type.rawValue].push(item);
        });
        this.nexts = nexts;
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const next of this.nexts) {
                yield next.prepare();
            }
        });
    }
    add(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = (0, sharp_1.default)(path, { animated: true });
                const metadata = yield file.metadata();
                if (metadata.format == "svg") {
                    for (const next of this.nexts) {
                        yield next.add(path);
                    }
                    return;
                }
                if (metadata.format == "gif") {
                    for (const item of this.coverters[CoverterType_1.default.gif.rawValue]) {
                        yield FilePath_1.default.copyToFolder(item.output.path, path);
                    }
                    return;
                }
                if (metadata.format == 'png' || metadata.format == 'jpg' || metadata.format == 'jpeg') {
                    if (metadata.width == undefined || metadata.height == undefined) {
                        return;
                    }
                    for (const item of this.coverters[CoverterType_1.default.icon.rawValue]) {
                        const basename = FilePath_1.default.basename(path);
                        const output = FilePath_1.default.filePath(item.output.path, FilePath_1.default.filename(basename.name + item.output.icon_suffix, basename.ext));
                        if (item.icon_scale == item.output.icon_scale) {
                            yield FilePath_1.default.copyFile(path, output);
                            continue;
                        }
                        yield file
                            .resize({
                            width: Math.round(metadata.width / item.icon_scale * item.output.icon_scale),
                            height: Math.round(metadata.height / item.icon_scale * item.output.icon_scale)
                        })
                            .toFile(output);
                    }
                    return;
                }
            }
            catch (error) {
                console.log(`IconIterator: 无法解析 ${path}`);
            }
        });
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const next of this.nexts) {
                yield next.finish();
            }
        });
    }
}
module.exports = IconIterator;
//# sourceMappingURL=IconIterator.js.map