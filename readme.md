# Khala [![npm version](https://img.shields.io/npm/v/khala)](https://npmjs.org/package/khala) 

**Khala** is a Node.js-based tool for processing and optimizing mobile graphics files.

## Installation
### Docker:
  ```shell
  docker run islinhey/khala  -c ./config.yaml 
  ```

### Node:
  ```shell
  npm -g install khala
  ```
  or
  ```shell
  yarn global add khala
  ```

  ## CLI usage

  ```shell
  khala -c ./config.yaml
  ```

## Configuration

### Report

| **Optional** | **Parameters** | **Description** |  | **Default** |
| --- | ---- | ---- | ------- | ---- |
| ✅            | **mode** | Report file mode | `json`, `human` | `json` |
| ❌ | **path** | Report file output path | string |  |

### Tasks

| **Optional** | **Parameters** | **Description** |             | **Default** |
| ------------ | -------------- | --------------- | ----------- | ----------- |
| ❌            | inputs         |                 | string[]    |             |
| ✅            | ignore         |                 | string[]    | []          |
| ✅            | fileLints      |                 | string[]    | []          |
| ✅            | coverters      |                 | Coverters[] |             |

### Coverters

| **Optional** | **Parameters**  | **Description**             |                  | **Default** |
| ------------ | --------------- | --------------------------- | ---------------- | ----------- |
| ❌            | type            | `gif`, `icon`,`svg`, `file` | string           |             |
| ✅            | icon_scale      |                             | number           | 3           |
| ✅            | output          | `CoverterOutput`            | `CoverterOutput` |             |
| ✅            | minimum_quality | minimum png file quality    | number           | 0.8         |
| ✅            | maximum_quality | maximum png file quality    | number           | 0.9         |

### CoverterOutput

| **Optional** | **Parameters**       | **Description**                                              |        | **Default**                 |
| ------------ | -------------------- | ------------------------------------------------------------ | ------ | --------------------------- |
| ✅            | type                 | `gif`, `icon`,`svg`, `file`,`vector_drawable`,`pdf`,`iconfont` | string | same `coverter: type`       |
| ❌            | path                 | output folder path                                           |        |                             |
| ✅            | iconfont_family_name | [iconfont] font family name                                  | string | iconfont                    |
| ✅            | iconfont_font_name   | [iconfont] font name                                         | string | iconfont                    |
| ✅            | icon_scale           |                                                              | number | same `coverter: icon_scale` |
| ✅            | icon_suffix          |                                                              | string |                             |
| ✅ | enable_compression_minimum_size | 该数值以下大小的 png 文件不会经过压缩 | string | 0 |

### Example:

```yaml
---
report:
  mode: 'json'
  path: "./report/report.json"
tasks:
- inputs:
  - "./assets/icons"
  ignore:
  - "./assets/icons/dui_analysis_icon.svg"
  fileLints:
  - name: "文件名只能使用大小写字母下划线"
    pattern: "^[a-zA-Z][0-9a-zA-Z\\_]*$"
  coverters:
  - type: gif
    output:
      path: "./products/android/x3"
  - type: gif
    output:
      path: "./products/ios/icon"
  - type: icon
    icon_scale: 3
    output:
      minimum_quality: 0.7
      maximum_quality: 0.8
      path: "./products/android/x2"
      icon_scale: 2
  - type: icon
    icon_scale: 3
    output:
      path: "./products/android/x3"
  - type: icon
    icon_scale: 3
    output:
      path: "./products/ios/icon"
      icon_scale: 2
      icon_suffix: "@2x"
  - type: icon
    icon_scale: 3
    output:
      path: "./products/ios/icon"
      icon_suffix: "@3x"
  - type: svg
    output:
      type: vector_drawable
      path: "./products/android/vector_template"
  - type: svg
    output:
      type: pdf
      path: "./products/ios/vector_template"
  - type: svg
    output:
      type: iconfont
      path: "./products/flutter/iconfont"
  - type: svg
    output:
      type: iconfont
      path: "./products/ios/iconfont"
      iconfont_family_name: khala_iconfont
      iconfont_font_name: khala_iconfont
- inputs:
  - "./assets/patch9_2x"
  coverters:
  - type: file
    output:
      file_excludes_same_name_with_different_suffixes: true
      path: "./products/android/x2"
- inputs:
  - "./assets/patch9_3x"
  coverters:
  - type: file
    output:
      file_excludes_same_name_with_different_suffixes: true
      path: "./products/android/x3"
```

## Donators

## License and Copyright

This software is released under the terms of the [Apache license](https://github.com/autoasset/Khala/blob/master/LICENSE).