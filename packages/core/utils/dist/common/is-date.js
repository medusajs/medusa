"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDate = void 0;
function isDate(value) {
    return value !== null && !isNaN(new Date(value).valueOf());
}
exports.isDate = isDate;
//# sourceMappingURL=is-date.js.map