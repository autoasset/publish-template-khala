"use strict";
var _a;
module.exports = (_a = class CoverterType {
        constructor(rawValue) {
            this.rawValue = rawValue;
        }
        static all() {
            return [
                this.gif,
                this.icon,
                this.svg,
                this.file
            ];
        }
        static init(rawValue) {
            for (const item of this.all()) {
                if (item.rawValue == rawValue) {
                    return item;
                }
            }
            return CoverterType.unknown;
        }
    },
    _a.gif = new _a("gif"),
    _a.icon = new _a("icon"),
    _a.svg = new _a("svg"),
    _a.file = new _a("file"),
    _a.unknown = new _a("unknown"),
    _a);
//# sourceMappingURL=CoverterType.js.map