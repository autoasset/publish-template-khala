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
class IconIterator {
    constructor(config, nexts) {
        this.config = config;
        this.nexts = nexts;
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            yield FilePath_1.default.createFolder(this.config.outputs.gif3x);
            yield FilePath_1.default.createFolder(this.config.outputs.gif2x);
            yield FilePath_1.default.createFolder(this.config.outputs.icon3x);
            yield FilePath_1.default.createFolder(this.config.outputs.icon2x);
            for (const next of this.nexts) {
                yield next.prepare();
            }
        });
    }
    add(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = (0, sharp_1.default)(path, { animated: true });
            const metadata = yield file.metadata();
            if (metadata.format == 'gif') {
                this.dealImage3x(file, path, metadata, this.config.outputs.gif3x);
                this.dealImage3x(file, path, metadata, this.config.outputs.gif2x);
                return;
            }
            if (metadata.format == 'png' || metadata.format == 'jpg' || metadata.format == 'jpeg') {
                this.dealImage3x(file, path, metadata, this.config.outputs.icon3x);
                this.dealImage2x(file, path, metadata, this.config.outputs.icon2x);
                return;
            }
            if (metadata.format == 'svg') {
                for (const next of this.nexts) {
                    yield next.add(path);
                }
                return;
            }
            FilePath_1.default.copyToFolder(this.config.outputs.other, FilePath_1.default.basename(path));
        });
    }
    dealImage3x(file, path, metadata, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            FilePath_1.default.copyToFolder(folder, path);
        });
    }
    dealImage2x(file, path, metadata, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            if (metadata.width == undefined) {
                return;
            }
            if (metadata.height == undefined) {
                return;
            }
            const output = FilePath_1.default.filePath(folder, FilePath_1.default.basename(path));
            yield file
                .resize({
                width: Math.round(metadata.width / 3 * 2),
                height: Math.round(metadata.height / 3 * 2)
            })
                .toFile(output);
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