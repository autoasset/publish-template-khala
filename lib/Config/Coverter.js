"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const CoverterOutput_1 = __importDefault(require("./CoverterOutput"));
const CoverterType_1 = __importDefault(require("./CoverterType"));
module.exports = class Coverter {
    constructor(json) {
        /// 默认图片倍率
        this.icon_scale = 3;
        /// 启用图片压缩的最低文件大小, 默认 0
        this.enable_compression_minimum_size = 0;
        this.type = CoverterType_1.default.init(json.stringValue("type"));
        this.icon_scale = json.numberValue("icon_scale", 3);
        this.name = json.string('name');
        this.enable_compression_minimum_size = json.numberValue("enable_compression_minimum_size", 0);
        this.output = new CoverterOutput_1.default(json.node("output"), this.type.rawValue, this.icon_scale);
    }
};
//# sourceMappingURL=Coverter.js.map