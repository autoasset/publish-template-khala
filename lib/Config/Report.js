"use strict";
module.exports = class Report {
    constructor(path) {
        this.path = "";
        this.path = path;
    }
    static init(json) {
        const path = json.stringValue("path");
        if (path === "") {
            return undefined;
        }
        else {
            return new Report(path);
        }
    }
};
//# sourceMappingURL=Report.js.map