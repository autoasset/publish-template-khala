"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KLJSON = void 0;
class KLJSON {
    constructor(value) {
        this.value = value;
    }
    node(from) {
        const value = this.value[from];
        return new KLJSON(value);
    }
    numberValue(from = undefined, placeholder = 0) {
        if (!from) {
            return this.value.toString();
        }
        const value = this.value[from];
        if (!value) {
            return placeholder;
        }
        return value;
    }
    stringValue(from = undefined, placeholder = "") {
        if (!from) {
            return this.value.toString();
        }
        const value = this.value[from];
        if (!value) {
            return placeholder;
        }
        return value;
    }
    arrayValue(from) {
        const value = this.value[from];
        if (!value) {
            return [];
        }
        return value.filter(item => item).map(item => new KLJSON(item));
    }
}
exports.KLJSON = KLJSON;
//# sourceMappingURL=KLJSON.js.map