export class KLJSON {

    value: any

    constructor(value: any) {
        this.value = value
    }

    node(from: string): KLJSON {
        const value = this.value[from]
        return new KLJSON(value)
    }

    numberValue(from: string | undefined = undefined, placeholder: number = 0): number {

        if (!from) {
            return this.value.toString()
        }

        const value = this.value[from] as number

        if (!value) {
            return placeholder
        }

        return value
    }

    stringValue(from: string | undefined = undefined, placeholder: string = ""): string {

        if (!from) {
            return this.value.toString()
        }

        const value = this.value[from] as string

        if (!value) {
            return placeholder
        }

        return value
    }

    arrayValue(from: string): KLJSON[] {
        const value = this.value[from] as any[]
        if (!value) {
            return []
        }
        return value.filter(item => item).map(item => new KLJSON(item))
    }

}