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

    /// [file]
    /// 是否排除不同后缀名同名文件
    file_excludes_same_name_with_different_suffixes: boolean

    constructor(json: KLJSON, type: string, icon_scale: number) {
        this.type = CoverterOutputType.init(json.stringValue("type", type))
        this.path = path.resolve(json.stringValue("path"))

        this.icon_scale = json.numberValue("icon_scale", icon_scale)
        this.icon_suffix = json.stringValue("icon_suffix")

        this.iconfont_family_name = json.stringValue("iconfont_family_name", "iconfont")
        this.iconfont_font_name = json.stringValue("iconfont_font_name", "iconfont")

        this.file_excludes_same_name_with_different_suffixes = json.booleanValue("file_excludes_same_name_with_different_suffixes")
    }
}