"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportHelper = void 0;
const FilePath_1 = __importDefault(require("./FilePath"));
class FileLintMessage {
    constructor(lint) {
        this.paths = [];
        this.lint = lint;
    }
    message() {
        var text = `name: ${this.lint.name}`;
        text += '\n';
        text += `pattern: ${this.lint.pattern}`;
        text += '\n';
        text += this.paths.join('\n');
        return text;
    }
}
class ReportHelper {
    constructor(report) {
        this.fileLints = {};
        this.report = report;
    }
    fileLintFail(path, lint) {
        if (this.report == undefined) {
            return;
        }
        const key = lint.name + lint.pattern;
        if (!this.fileLints[key]) {
            this.fileLints[key] = new FileLintMessage(lint);
        }
        this.fileLints[key].paths.push(path);
    }
    output() {
        if (this.report == undefined) {
            return;
        }
        var text = "";
        const message = this.fileLintsMessage();
        if (message) {
            text += message;
        }
        FilePath_1.default.write(this.report.path, text);
    }
    fileLintsMessage() {
        if (this.report == undefined || Object.keys(this.fileLints).length <= 0) {
            return undefined;
        }
        var text = "FileLint\n\n";
        for (const key in this.fileLints) {
            text += this.fileLints[key].message();
            text += "\n";
        }
        return text;
    }
}
exports.ReportHelper = ReportHelper;
//# sourceMappingURL=ReportHelper.js.map