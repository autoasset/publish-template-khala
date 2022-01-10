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
    pathArrayValue(from) {
        return this.arrayValue(from).map(item => path_1.default.resolve(item.stringValue())).filter(item => item.length > 0);
    }
}
exports.KLJSON = KLJSON;
//# sourceMappingURL=KLJSON.js.map