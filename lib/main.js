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
const IconCoverter_1 = __importDefault(require("./IconCoverter"));
const SVGCoverter_1 = __importDefault(require("./SVGCoverter"));
const ProductsCoverter_1 = __importDefault(require("./ProductsCoverter"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield IconCoverter_1.default.run((file, name) => __awaiter(void 0, void 0, void 0, function* () {
            yield SVGCoverter_1.default.run(SVGCoverter_1.default, file, name);
        }));
        yield SVGCoverter_1.default.finish(SVGCoverter_1.default);
        yield ProductsCoverter_1.default.run();
    }
    catch (error) {
        console.log(error);
    }
}))();
//# sourceMappingURL=main.js.map