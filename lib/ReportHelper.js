"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportHelper = void 0;
const FilePath_1 = __importDefault(require("./FilePath/FilePath"));
class FileLintMessage {
    constructor(lint) {
        this.paths = [];
        this.lint = lint;
    }
    json() {
        return {
            name: this.lint.name,
            pattern: this.lint.pattern,
            paths: this.paths
        };
    }
    human() {
        return [
            `lint: ${this.lint.name} | pattern: ${this.lint.pattern}`,
            this.paths.map(item => `==> ${item}`).join('\n')
        ];
    }
}
class ReportHelper {
    constructor(report) {
        this.fileLints = {};
        this.beginTime = new Date().getTime();
        this.report = report;
    }
    fileLintFail(file, lint) {
        if (this.report == undefined) {
            return;
        }
        const key = lint.name + lint.pattern;
        if (!this.fileLints[key]) {
            this.fileLints[key] = new FileLintMessage(lint);
        }
        const filePath = FilePath_1.default.relativeCWD(file);
        this.fileLints[key].paths.push(filePath);
    }
    output() {
        if (!this.report) {
            return;
        }
        if (this.report.mode == 'json') {
            FilePath_1.default.write(this.report.path, JSON.stringify(this.json(), null, 4));
        }
        else if (this.report.mode == 'human') {
            FilePath_1.default.write(this.report.path, this.human().join('\n'));
        }
    }
    json() {
        if (!this.report) {
            return {};
        }
        return {
            'duration': this.duration(),
            'fileLints': this.recordValues(this.fileLints).map(item => item.json())
        };
    }
    human() {
        return [`duration: ${this.duration()}s`]
            .concat(this.itemHuman('FileLints', this.fileLints));
    }
    duration() {
        return (new Date().getTime() - this.beginTime) / 1000;
    }
    itemHuman(title, record) {
        if (!record) {
            return [];
        }
        var list = this.recordValues(record).map(item => item.human()).flat();
        if (list.length == 0) {
            return [];
        }
        return [title].concat(list);
    }
    recordValues(record) {
        var list = [];
        for (const key in record) {
            list.push(record[key]);
        }
        return list;
    }
}
exports.ReportHelper = ReportHelper;
//# sourceMappingURL=ReportHelper.js.map