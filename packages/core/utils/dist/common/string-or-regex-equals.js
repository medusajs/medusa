"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringEqualsOrRegexMatch = void 0;
var stringEqualsOrRegexMatch = function (stringOrRegex, testString) {
    if (stringOrRegex instanceof RegExp) {
        return stringOrRegex.test(testString);
    }
    return stringOrRegex === testString;
};
exports.stringEqualsOrRegexMatch = stringEqualsOrRegexMatch;
//# sourceMappingURL=string-or-regex-equals.js.map