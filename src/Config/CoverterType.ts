export = class CoverterType {

    static gif     = new CoverterType("gif")
    static icon    = new CoverterType("icon")
    static svg     = new CoverterType("svg")
    static file    = new CoverterType("file")
    static unknown = new CoverterType("unknown")

    static all(): CoverterType[] {
        return [
            this.gif,
            this.icon,
            this.svg,
            this.file
        ]
    }

    static init(rawValue: string): CoverterType {
        for (const item of this.all()) {
            if (item.rawValue == rawValue) {
                return item
            }
        }
        return CoverterType.unknown
    }

    rawValue: string

    private constructor(rawValue: string) {
        this.rawValue = rawValue
    }

}