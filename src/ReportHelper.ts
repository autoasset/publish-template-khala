import FileLint from "./Config/FileLints";
import Report from "./Config/Report";
import FilePath from "./FilePath/FilePath";

interface HumanMessage {
    human(): string[]
    json(): object
}

class FileLintMessage implements HumanMessage {

    paths: string[] = []
    lint: FileLint

    constructor(lint: FileLint) {
        this.lint = lint
    }

    json(): object {
        return {
            name: this.lint.name,
            pattern: this.lint.pattern,
            paths: this.paths
        }
    }

    human(): string[] {
        return [
            `lint: ${this.lint.name} | pattern: ${this.lint.pattern}`,
            this.paths.map(item => `==> ${item}`).join('\n')
        ]
    }
}

export class ReportHelper implements HumanMessage {

    fileLints: Record<string, FileLintMessage> = {}
    beginTime = new Date().getTime()

    report?: Report

    constructor(report?: Report) {
        this.report = report
    }

    fileLintFail(file: string, lint: FileLint) {
        if (this.report == undefined) {
            return
        }

        const key = lint.name + lint.pattern
        if (!this.fileLints[key]) {
            this.fileLints[key] = new FileLintMessage(lint)
        }
        const filePath = FilePath.relativeCWD(file)
        this.fileLints[key].paths.push(filePath)
    }

    output() {
        if (!this.report) {
            return
        }

        if (this.report.mode == 'json') {
            FilePath.write(this.report.path, JSON.stringify(this.json(), null, 4))
        } else if (this.report.mode == 'human') {
            FilePath.write(this.report.path, this.human().join('\n'))
        }
    }

    json(): object {
        if (!this.report) {
            return {}
        }

        return {
            'duration': this.duration(),
            'fileLints': this.recordValues(this.fileLints).map(item => item.json())
        }
    }

    human(): string[] {
        return [`duration: ${this.duration()}s`]
            .concat(this.itemHuman('FileLints', this.fileLints))
    }

    duration(): number {
        return (new Date().getTime() - this.beginTime) / 1000
    }

    itemHuman<T extends HumanMessage>(title: string, record?: Record<string, T>): string[] {
        if (!record) {
            return []
        }

        var list = this.recordValues(record).map(item => item.human()).flat()

        if (list.length == 0) {
            return []
        }
        return [title].concat(list)
    }

    recordValues<T extends HumanMessage>(record: Record<string, T>): T[] {
        var list: T[] = []
        for (const key in record) {
            list.push(record[key])
        }
        return list
    }
}