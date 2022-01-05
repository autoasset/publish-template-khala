import IconTask from "./IconTask";
import { KLJSON } from "./KLJSON";

class Config {

    tasks: IconTask[]

    constructor(json: any) {
        this.tasks = (new KLJSON(json)).arrayValue("tasks").map(item => new IconTask(item))
    }

}

export = Config