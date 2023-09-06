"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUri = void 0;
const formatUri = (uri) => {
    var _a;
    let url;
    try {
        url = new URL(uri);
    }
    catch (_) {
        const formatted = (_a = /[\w||\d].*/.exec(uri)) === null || _a === void 0 ? void 0 : _a[0];
        return `https://${formatted}`;
    }
    return url.href;
};
exports.formatUri = formatUri;
//# sourceMappingURL=format-uri.js.map