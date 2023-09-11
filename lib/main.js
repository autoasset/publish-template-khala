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
const FileIterator_1 = __importDefault(require("./Iterators/FileIterator"));
const IconIterator_1 = __importDefault(require("./Iterators/IconIterator"));
const SVGIterator_1 = __importDefault(require("./Iterators/SVGIterator"));
const SVGFontIterator_1 = __importDefault(require("./Iterators/SVGFontIterator"));
const FilePath_1 = __importDefault(require("./FilePath/FilePath"));
const fs_1 = __importDefault(require("fs"));
const Config_1 = __importDefault(require("./Config/Config"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const ReportHelper_1 = require("./ReportHelper");
module.exports = class Main {
    constructor(path) {
        var json;
        const file = fs_1.default.readFileSync(path).toString();
        try {
            json = JSON.parse(file);
        }
        catch (error) {
            try {
                json = js_yaml_1.default.load(file);
            }
            catch (error) {
                throw Error('input yaml or json file path');
            }
        }
        this.config = new Config_1.default(json);
        this.report = new ReportHelper_1.ReportHelper(this.config.report);
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
            const svgIterator = new SVGIterator_1.default(task.coverters, this.report);
            const iconIterator = new IconIterator_1.default(task.coverters, [svgIterator, svgFontIterator]);
            const fileIterator = new FileIterator_1.default(task, [iconIterator], this.report);
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
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            this.report.output();
        });
    }
};
//# sourceMappingURL=main.js.map