import path from "path"
import { KLJSON } from "./KLJSON"

export = class Report {

    mode: 'json' | 'human' = 'json'
    path: string = ""

    static init(json: KLJSON): Report | undefined {
        const pathValue = path.resolve(json.stringValue("path"))
        if (pathValue.length <= 0) {
            return undefined
        }

        const model = new Report(pathValue)

        if (json.stringValue('mode') == 'human') {
            model.mode = 'human'
        }

        return model
    }

    private constructor(path: string) {
        this.path = path
    }

}