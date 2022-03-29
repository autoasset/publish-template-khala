#!/usr/bin/env node
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
const main_1 = __importDefault(require("./main"));
const commander_1 = require("commander");
const program = new commander_1.Command()
    .version('1.0.7', '-v, --version', 'output the current version')
    .option('-c, --config <config>', 'config path')
    .parse(process.argv);
const options = program.opts();
if (options.config) {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const main = new main_1.default(options.config);
            yield main.prepare();
            yield main.run();
            yield main.finish();
            console.log(main.report.human().join('\n'));
        }
        catch (error) {
            console.log(error);
        }
    }))();
}
//# sourceMappingURL=cli-main.js.map