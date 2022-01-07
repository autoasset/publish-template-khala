import FileLint from "./Config/FileLints";
import Report from "./Config/Report";
import FilePath from "./FilePath";

interface HumanMessage {
    message(): string
}

class FileLintMessage implements HumanMessage {

    paths: string[] = []
    lint: FileLint

    constructor(lint: FileLint) {
        this.lint = lint
    }

    message(): string {
        var text = `name: ${this.lint.name}`
        text += '\n'
        text += `pattern: ${this.lint.pattern}`
        text += '\n'
        text += this.paths.join('\n')
        return text
    }
}

export class ReportHelper {

    fileLints: Record<string, FileLintMessage> = {}

    report?: Report

    constructor(report?: Report) {
        this.report = report
    }

    fileLintFail(path: string, lint: FileLint) {
        if (this.report == undefined) {
            return
        }

        const key = lint.name + lint.pattern
        if (!this.fileLints[key]) {
            this.fileLints[key] = new FileLintMessage(lint)
        }
        this.fileLints[key].paths.push(path)
    }

    output() {
        if (this.report == undefined) {
            return
        }

        var text = ""

        const message = this.fileLintsMessage()

        if (message) {
            text += message
        }

        FilePath.write(this.report.path, text)
    }

    fileLintsMessage(): string | undefined {
        if (this.report == undefined || Object.keys(this.fileLints).length <= 0) {
            return undefined
        }

        var text = "FileLint\n\n"

        for (const key in this.fileLints) {
            text += this.fileLints[key].message()
            text += "\n"
        }

        return text
    }
}