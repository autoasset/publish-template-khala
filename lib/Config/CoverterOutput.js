"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const CoverterOutputType_1 = __importDefault(require("./CoverterOutputType"));
const path_1 = __importDefault(require("path"));
module.exports = class CoverterOutput {
    constructor(json, type, icon_scale) {
        this.type = CoverterOutputType_1.default.init(json.stringValue("type", type));
        this.path = path_1.default.resolve(json.stringValue("path"));
        this.icon_scale = json.numberValue("icon_scale", icon_scale);
        this.icon_suffix = json.stringValue("icon_suffix");
        this.minimum_quality = json.numberValue("minimum_quality", 0.8);
        this.maximum_quality = json.numberValue("maximum_quality", 0.9);
        this.minimum_quality = Math.min(this.minimum_quality, this.maximum_quality);
        this.maximum_quality = Math.max(this.minimum_quality, this.maximum_quality);
        this.iconfont_family_name = json.stringValue("iconfont_family_name", "iconfont");
        this.iconfont_font_name = json.stringValue("iconfont_font_name", "iconfont");
        this.file_excludes_same_name_with_different_suffixes = json.booleanValue("file_excludes_same_name_with_different_suffixes");
    }
};
//# sourceMappingURL=CoverterOutput.js.map