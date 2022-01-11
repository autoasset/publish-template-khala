"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KLJSON = void 0;
const path_1 = __importDefault(require("path"));
class KLJSON {
    constructor(value) {
        this.value = value;
    }
    node(from) {
        const value = this.value[from];
        return new KLJSON(value);
    }
    booleanValue(from = undefined, placeholder = false) {
        return this.parseValue(from, placeholder);
    }
    numberValue(from = undefined, placeholder = 0) {
        return this.parseValue(from, placeholder);
    }
    stringValue(from = undefined, placeholder = "") {
        return this.parseValue(from, placeholder);
    }
    arrayValue(from) {
        const value = this.value[from];
        if (!value) {
            return [];
        }
        return value.filter(item => item).map(item => new KLJSON(item));
    }
    pathArrayValue(from) {
        return this.arrayValue(from).map(item => path_1.default.resolve(item.stringValue())).filter(item => item.length > 0);
    }
    parseValue(from = undefined, placeholder) {
        var _a, _b;
        if (!from) {
            return (_a = this.value) !== null && _a !== void 0 ? _a : placeholder;
        }
        return (_b = this.value[from]) !== null && _b !== void 0 ? _b : placeholder;
    }
}
exports.KLJSON = KLJSON;
//# sourceMappingURL=KLJSON.js.map