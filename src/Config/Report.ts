import { KLJSON } from "./KLJSON"

export = class Report {

    path: string = ""

    static init(json: KLJSON): Report | undefined {
        const path = json.stringValue("path")
        if (path === "") {
            return undefined
        } else {
            return new Report(path)
        }
    }

    private constructor(path: string) {
        this.path = path
    }

}