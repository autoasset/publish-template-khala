export = class CoverterOutputType {

    static gif                  = new CoverterOutputType("gif")
    static android_smart_mixed  = new CoverterOutputType("android_smart_mixed")
    static ios_smart_mixed      = new CoverterOutputType("ios_smart_mixed")
    static icon                 = new CoverterOutputType("icon")
    static svg                  = new CoverterOutputType("svg")
    static pdf                  = new CoverterOutputType("pdf")
    static iconfont             = new CoverterOutputType("iconfont")
    static file                 = new CoverterOutputType("file")
    static unknown              = new CoverterOutputType("unknown")
    static vector_drawable      = new CoverterOutputType("vector_drawable")

    static all(): CoverterOutputType[] {
       return [
            this.gif,
            this.ios_smart_mixed,
            this.android_smart_mixed,
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