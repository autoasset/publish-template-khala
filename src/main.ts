import FileIterator from './FileIterator';
import IconIterator from './IconIterator';
import SVGIterator from "./SVGIterator";
import SVGFontIterator from "./SVGFontIterator";
import FilePath from './FilePath';
import fs from 'fs';
import IconTask from './Config/IconTask';
import Config from './Config/Config';
import YAML from 'js-yaml'

class Main {

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
        const fileIterator = new FileIterator(task, [iconIterator])

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

}

(async () => {
    const main = new Main('./config.yaml', './config.json')
    await main.prepare()
    await main.run()
})();