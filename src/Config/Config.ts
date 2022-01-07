import IconTask from "./IconTask";
import { KLJSON } from "./KLJSON";
import Report from "./Report";

class Config {

    report: Report | undefined
    tasks: IconTask[]

    constructor(data: any) {
        const json = new KLJSON(data)
        this.report = Report.init(json.node("report"))
        this.tasks = json.arrayValue("tasks").map(item => new IconTask(item))
    }

}

export = Config