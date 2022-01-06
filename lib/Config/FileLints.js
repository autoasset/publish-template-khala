"use strict";
module.exports = class FileLint {
    constructor(name, pattern) {
        this.pattern = pattern;
        this.name = name;
    }
    static init(json) {
        const pattern = json.stringValue("pattern");
        if (pattern === "") {
            return undefined;
        }
        else {
            return new FileLint(json.stringValue("name", pattern), pattern);
        }
    }
};
//# sourceMappingURL=FileLints.js.map