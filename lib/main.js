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
Object.defineProperty(exports, "__esModule", { value: true });
const FileIterator_1 = __importDefault(require("./FileIterator"));
const IconIterator_1 = __importDefault(require("./IconIterator"));
const SVGIterator_1 = __importDefault(require("./SVGIterator"));
const SVGFontIterator_1 = __importDefault(require("./SVGFontIterator"));
const FilePath_1 = __importDefault(require("./FilePath"));
const fs_1 = __importDefault(require("fs"));
const Config_1 = __importDefault(require("./Config/Config"));
const js_yaml_1 = __importDefault(require("js-yaml"));
class Main {
    constructor(yaml, json_path) {
        var json;
        try {
            const file = fs_1.default.readFileSync(yaml).toString();
            json = js_yaml_1.default.load(file);
        }
        catch (error) {
            const file = fs_1.default.readFileSync(json_path).toString();
            json = JSON.parse(file);
        }
        this.config = new Config_1.default(json);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const item of this.config.tasks) {
                yield this.runTask(item);
            }
        });
    }
    runTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const svgFontIterator = new SVGFontIterator_1.default(task.coverters);
            const svgIterator = new SVGIterator_1.default(task.coverters);
            const iconIterator = new IconIterator_1.default(task.coverters, [svgIterator, svgFontIterator]);
            const fileIterator = new FileIterator_1.default(task, [iconIterator]);
            yield fileIterator.prepare();
            yield fileIterator.run();
            yield fileIterator.finish();
        });
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            const paths = this.config.tasks.map((task) => {
                return task.coverters.map((coverter) => {
                    return coverter.output.path;
                });
            }).flat();
            for (const path of paths) {
                yield FilePath_1.default.delete(path);
                yield FilePath_1.default.createFolder(path);
            }
        });
    }
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const main = new Main('./config.yaml', './config.json');
    yield main.prepare();
    yield main.run();
}))();
//# sourceMappingURL=main.js.map