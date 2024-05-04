"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleProvider = exports.EmailPasswordProvider = void 0;
var email_password_1 = require("./email-password");
Object.defineProperty(exports, "EmailPasswordProvider", { enumerable: true, get: function () { return __importDefault(email_password_1).default; } });
var google_1 = require("./google");
Object.defineProperty(exports, "GoogleProvider", { enumerable: true, get: function () { return __importDefault(google_1).default; } });
