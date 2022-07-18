import CoverterOutputType from "./CoverterOutputType"
import { KLJSON } from "./KLJSON"
import path from "path"

export = class CoverterOutput {
    /// 输出类型选项
    type: CoverterOutputType
    path: string

    /// [iconfont] 配置
    /// family 名
    iconfont_family_name: string
    /// font 名
    iconfont_font_name: string

    /// [icon] 配置
    /// 缩放倍率
    icon_scale: number
    /// 文件后缀
    icon_suffix: string
    /// 最低压缩比例, 默认 0.8
    minimum_quality: number
    /// 最高压缩比例, 默认 0.9
    maximum_quality: number

    /// [file]
    /// 是否排除不同后缀名同名文件
    file_excludes_same_name_with_different_suffixes: boolean

    constructor(json: KLJSON, type: string, icon_scale: number) {
        this.type = CoverterOutputType.init(json.stringValue("type", type))
        this.path = path.resolve(json.stringValue("path"))

        this.icon_scale = json.numberValue("icon_scale", icon_scale)
        this.icon_suffix = json.stringValue("icon_suffix")

        this.minimum_quality = json.numberValue("minimum_quality", 0.8)
        this.maximum_quality = json.numberValue("maximum_quality", 0.9)
        this.minimum_quality = Math.min(this.minimum_quality, this.maximum_quality)
        this.maximum_quality = Math.max(this.minimum_quality, this.maximum_quality)

        this.iconfont_family_name = json.stringValue("iconfont_family_name", "iconfont")
        this.iconfont_font_name = json.stringValue("iconfont_font_name", "iconfont")

        this.file_excludes_same_name_with_different_suffixes = json.booleanValue("file_excludes_same_name_with_different_suffixes")
    }
}