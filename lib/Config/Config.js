"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const IconTask_1 = __importDefault(require("./IconTask"));
const KLJSON_1 = require("./KLJSON");
const Report_1 = __importDefault(require("./Report"));
class Config {
    constructor(data) {
        const json = new KLJSON_1.KLJSON(data);
        this.report = Report_1.default.init(json.node("report"));
        this.tasks = json.arrayValue("tasks").map(item => new IconTask_1.default(item));
    }
}
module.exports = Config;
//# sourceMappingURL=Config.js.map