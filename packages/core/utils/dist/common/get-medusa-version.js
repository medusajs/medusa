"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedusaVersion = void 0;
var path_1 = require("path");
var getMedusaVersion = function () {
    try {
        return require((0, path_1.join)(process.cwd(), "node_modules", "@medusajs/medusa", "package.json")).version;
    }
    catch (e) {
        return "";
    }
};
exports.getMedusaVersion = getMedusaVersion;
//# sourceMappingURL=get-medusa-version.js.map