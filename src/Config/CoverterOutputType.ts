export = class CoverterOutputType {

    static gif = new CoverterOutputType("gif")
    static icon = new CoverterOutputType("icon")
    static svg = new CoverterOutputType("svg")
    static vector_drawable = new CoverterOutputType("vector_drawable")
    static pdf = new CoverterOutputType("pdf")
    static iconfont = new CoverterOutputType("iconfont")
    static file = new CoverterOutputType("file")
    static unknown = new CoverterOutputType("unknown")

    static all(): CoverterOutputType[] {
       return [
            this.gif,
            this.icon,
            this.svg,
            this.vector_drawable,
            this.pdf,
            this.file,
            this.iconfont
        ]
    }

    static init(rawValue: string): CoverterOutputType {
        for (const item of this.all()) {
            if (item.rawValue == rawValue) {
                return item
            }
        }
        return CoverterOutputType.unknown
    }

    rawValue: string

    private constructor(rawValue: string) {
        this.rawValue = rawValue
    }

}