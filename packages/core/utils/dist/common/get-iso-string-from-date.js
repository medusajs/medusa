"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetIsoStringFromDate = void 0;
var is_date_1 = require("./is-date");
var errors_1 = require("./errors");
var GetIsoStringFromDate = function (date) {
    if (!(0, is_date_1.isDate)(date)) {
        throw new errors_1.MedusaError(errors_1.MedusaError.Types.INVALID_DATA, "Cannot format date to ISO string: ".concat(date));
    }
    date = new Date(date);
    return date.toISOString();
};
exports.GetIsoStringFromDate = GetIsoStringFromDate;
//# sourceMappingURL=get-iso-string-from-date.js.map