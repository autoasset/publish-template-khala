"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const config = __importStar(require("./config.json"));
const path_1 = __importDefault(require("path"));
function filePath(value) {
    value = value.trim();
    if (!value) {
        return value;
    }
    else {
        return path_1.default.resolve(value);
    }
}
class AndroidProductsBuildSettings {
    constructor() {
        this.copy_2x_inputs = config.products.android.build_settings.copy_2x_inputs.map((item) => filePath(item));
        this.copy_3x_inputs = config.products.android.build_settings.copy_3x_inputs.map((item) => filePath(item));
    }
}
class AndroidProducts {
    constructor() {
        this.vector_template = filePath(config.products.android.vector_template);
        this.x2 = filePath(config.products.android.x2);
        this.x3 = filePath(config.products.android.x3);
        this.build_settings = new AndroidProductsBuildSettings();
    }
}
class Products {
    constructor() {
        this.ios = {
            vector_template: filePath(config.products.ios.vector_template),
            icon: filePath(config.products.ios.icon),
            gif: filePath(config.products.ios.gif),
            iconfont: filePath(config.products.ios.iconfont),
        };
        this.android = new AndroidProducts();
        this.flutter = {
            iconfont: filePath(config.products.flutter.iconfont)
        };
    }
}
class Outputs {
    constructor() {
        this.gif2x = filePath(config.outputs.gif2x);
        this.gif3x = filePath(config.outputs.gif3x);
        this.icon2x = filePath(config.outputs.icon2x);
        this.icon3x = filePath(config.outputs.icon3x);
        this.other = filePath(config.outputs.other);
        this.pdf = filePath(config.outputs.pdf);
        this.svg = filePath(config.outputs.svg);
        this.svg2pdf = filePath(config.outputs.svg2pdf);
        this.svg2xml = filePath(config.outputs.svg2xml);
        this.svg2iconfont = filePath(config.outputs.svg2iconfont);
        this.svg2custom_iconfont = filePath(config.outputs.svg2custom_iconfont);
        this.custom_iconfont_family = config.outputs.custom_iconfont_family;
        this.allPaths = [this.gif2x,
            this.gif3x,
            this.icon2x,
            this.icon3x,
            this.other,
            this.pdf,
            this.svg,
            this.svg2pdf,
            this.svg2xml,
            this.svg2iconfont,
            this.svg2custom_iconfont];
    }
}
class IconConfig {
    constructor(path) {
        this.inputs = config.inputs.map((item) => filePath(item));
        this.exclude = config.exclude.map((item) => filePath(item));
        this.outputs = new Outputs();
        this.products = new Products();
    }
}
module.exports = IconConfig;
//# sourceMappingURL=config.js.map