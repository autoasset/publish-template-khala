"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const IconTask_1 = __importDefault(require("./IconTask"));
const KLJSON_1 = require("./KLJSON");
class Config {
    constructor(json) {
        this.tasks = (new KLJSON_1.KLJSON(json)).arrayValue("tasks").map(item => new IconTask_1.default(item));
    }
}
module.exports = Config;
//# sourceMappingURL=Config.js.map