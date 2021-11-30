"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProductsIterator_1 = __importDefault(require("./ProductsIterator"));
const FileIterator_1 = __importDefault(require("./FileIterator"));
const config_1 = __importDefault(require("./config"));
const IconIterator_1 = __importDefault(require("./IconIterator"));
const SVGIterator_1 = __importDefault(require("./SVGIterator"));
const SVGFontIterator_1 = __importDefault(require("./SVGFontIterator"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = new config_1.default('./config.json');
        const svgFontIterator = new SVGFontIterator_1.default(config);
        const svgIterator = new SVGIterator_1.default(config);
        const iconIterator = new IconIterator_1.default(config, [svgIterator, svgFontIterator]);
        const fileIterator = new FileIterator_1.default(config, [iconIterator]);
        yield fileIterator.prepare();
        yield fileIterator.run();
        yield fileIterator.finish();
        const productsIterator = new ProductsIterator_1.default(config);
        yield productsIterator.prepare();
        yield productsIterator.run();
        yield productsIterator.finish();
    }
    catch (error) {
        console.log(error);
    }
}))();
//# sourceMappingURL=main.js.map