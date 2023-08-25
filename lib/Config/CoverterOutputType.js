"use strict";
var _a;
module.exports = (_a = class CoverterOutputType {
        static all() {
            return [
                this.gif,
                this.icon,
                this.svg,
                this.vector_drawable,
                this.pdf,
                this.file,
                this.iconfont
            ];
        }
        static init(rawValue) {
            for (const item of this.all()) {
                if (item.rawValue == rawValue) {
                    return item;
                }
            }
            return CoverterOutputType.unknown;
        }
        constructor(rawValue) {
            this.rawValue = rawValue;
        }
    },
    _a.gif = new _a("gif"),
    _a.icon = new _a("icon"),
    _a.svg = new _a("svg"),
    _a.vector_drawable = new _a("vector_drawable"),
    _a.pdf = new _a("pdf"),
    _a.iconfont = new _a("iconfont"),
    _a.file = new _a("file"),
    _a.unknown = new _a("unknown"),
    _a);
//# sourceMappingURL=CoverterOutputType.js.map