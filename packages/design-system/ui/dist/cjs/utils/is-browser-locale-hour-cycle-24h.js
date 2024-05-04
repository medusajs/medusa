"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowserLocaleClockType24h = void 0;
const isBrowserLocaleClockType24h = () => {
    const language = typeof window !== "undefined" ? window.navigator.language : "en-US";
    const hr = new Intl.DateTimeFormat(language, {
        hour: "numeric",
    }).format();
    return Number.isInteger(Number(hr));
};
exports.isBrowserLocaleClockType24h = isBrowserLocaleClockType24h;
//# sourceMappingURL=is-browser-locale-hour-cycle-24h.js.map