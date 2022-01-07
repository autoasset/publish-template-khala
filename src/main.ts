import FileIterator from './FileIterator';
import IconIterator from './IconIterator';
import SVGIterator from "./SVGIterator";
import SVGFontIterator from "./SVGFontIterator";
import FilePath from './FilePath';
import fs from 'fs';
import IconTask from './Config/IconTask';
import Config from './Config/Config';
import YAML from 'js-yaml'
import { ReportHelper } from './ReportHelper';

class Main {

    report: ReportHelper
    config: Config

    constructor(yaml: string, json_path: string) {
        var json: any
        try {
            const file = fs.readFileSync(yaml).toString()
            json = YAML.load(file)
        } catch (error) {
            const file = fs.readFileSync(json_path).toString()
            json = JSON.parse(file)
        }
        this.config = new Config(json)
        this.report = new ReportHelper(this.config.report)
    }

    async run() {
       for (const item of this.config.tasks) {
             await this.runTask(item)
       }
    }

    async runTask(task: IconTask) {
        const svgFontIterator = new SVGFontIterator(task.coverters)
        const svgIterator = new SVGIterator(task.coverters)
        const iconIterator = new IconIterator(task.coverters, [svgIterator, svgFontIterator])
        const fileIterator = new FileIterator(task, [iconIterator], this.report)

        await fileIterator.prepare()
        await fileIterator.run()
        await fileIterator.finish()
    }

    async prepare() {
        const paths = this.config.tasks.map((task) => {
            return task.coverters.map((coverter) => {
                return coverter.output.path
            })
        }).flat()

        for (const path of paths) {
            await FilePath.delete(path)
            await FilePath.createFolder(path)
        }
    }

    async finish() {
        this.report.output()
    }

}

(async () => {
    const main = new Main('./config.yaml', './config.json')
    await main.prepare()
    await main.run()
    await main.finish()
})();