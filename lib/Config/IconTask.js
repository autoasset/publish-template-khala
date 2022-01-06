"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Coverter_1 = __importDefault(require("./Coverter"));
const FileLints_1 = __importDefault(require("./FileLints"));
module.exports = class IconTask {
    constructor(json) {
        /// 扫描路径
        this.inputs = [];
        /// 忽略路径
        this.ignore = [];
        this.inputs = json.arrayValue("inputs").map(item => item.stringValue());
        this.ignore = json.arrayValue("ignore").map(item => item.stringValue());
        this.coverters = json.arrayValue("coverters").map(item => new Coverter_1.default(item));
        this.fileLints = json.arrayValue("fileLints").flatMap((item) => {
            const element = FileLints_1.default.init(item);
            return element === undefined ? [] : element;
        });
    }
};
//# sourceMappingURL=IconTask.js.map