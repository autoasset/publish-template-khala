"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
module.exports = class Report {
    constructor(path) {
        this.mode = 'json';
        this.path = "";
        this.path = path;
    }
    static init(json) {
        const pathValue = path_1.default.resolve(json.stringValue("path"));
        if (pathValue.length <= 0) {
            return undefined;
        }
        const model = new Report(pathValue);
        if (json.stringValue('mode') == 'human') {
            model.mode = 'human';
        }
        return model;
    }
};
//# sourceMappingURL=Report.js.map