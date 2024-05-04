"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
var errors_1 = require("./errors");
var EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/**
 * Check whether provided string is an email.
 * @param email - string to check
 */
function isEmail(email) {
    return email.toLowerCase().match(EMAIL_REGEX);
}
/**
 * Used to validate user email.
 * @param {string} email - email to validate
 * @return {string} the validated email
 */
function validateEmail(email) {
    var validatedEmail = isEmail(email);
    if (!validatedEmail) {
        throw new errors_1.MedusaError(errors_1.MedusaError.Types.INVALID_DATA, "The email is not valid");
    }
    return email.toLowerCase();
}
exports.validateEmail = validateEmail;
//# sourceMappingURL=is-email.js.map