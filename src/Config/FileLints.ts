import { KLJSON } from "./KLJSON"

export = class FileLint {

    name: string
    pattern: string

    static init(json: KLJSON): FileLint | undefined {
        const pattern = json.stringValue("pattern")
        if (pattern === "") {
            return undefined
        } else {
            return new FileLint(json.stringValue("name", pattern), pattern)
        }
    }

    private constructor(name: string, pattern: string) {
        this.pattern = pattern
        this.name = name
    }

}