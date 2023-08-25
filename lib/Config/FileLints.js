"use strict";
module.exports = class FileLint {
    static init(json) {
        const pattern = json.stringValue("pattern");
        if (pattern === "") {
            return undefined;
        }
        else {
            return new FileLint(json.stringValue("name", pattern), pattern);
        }
    }
    constructor(name, pattern) {
        this.pattern = pattern;
        this.name = name;
    }
};
//# sourceMappingURL=FileLints.js.map