#!/usr/bin/env node
import Main from './main'
import { Command } from 'commander';

const program = new Command()
    .version('1.0.8', '-v, --version', 'output the current version')
    .option('-c, --config <config>', 'config path')
    .parse(process.argv);

const options = program.opts();

if (options.config) {
    (async () => {
        try {
            const main = new Main(options.config)
            await main.prepare()
            await main.run()
            await main.finish()
            console.log(main.report.human().join('\n'))
        } catch (error) {
            console.log(error)
        }
    })();
}


