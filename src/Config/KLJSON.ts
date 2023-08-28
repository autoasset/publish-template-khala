import path from "path"

export class KLJSON {

    value: any

    constructor(value: any) {
        this.value = value
    }

    node(from: string): KLJSON {
        const value = this.value[from]
        return new KLJSON(value)
    }

    booleanValue(from: string | undefined = undefined, placeholder: boolean = false): boolean {
        return this.parseValue(from, placeholder)
    }

    numberValue(from: string | undefined = undefined, placeholder: number = 0): number {
        return this.parseValue(from, placeholder)
    }

    stringValue(from: string | undefined = undefined, placeholder: string = ""): string {
        return this.parseValue(from, placeholder)
    }

    string(from: string | undefined = undefined): string | undefined {
        return this.parse(from)
    }

    arrayValue(from: string): KLJSON[] {
        const value = this.value[from] as any[]
        if (!value) {
            return []
        }
        return value.filter(item => item).map(item => new KLJSON(item))
    }

    pathArrayValue(from: string): string[] {
        return this.arrayValue(from).map(item => path.resolve(item.stringValue())).filter(item => item.length > 0)
    }

    private parseValue<T>(from: string | undefined = undefined, placeholder: T): T {
        return this.parse(from) ?? placeholder
    }

    private parse<T>(from: string | undefined = undefined): T | undefined {
        if (!from) {
            return this.value as T
        }
        return this.value[from] as T
    }
}