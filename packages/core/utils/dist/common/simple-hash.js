"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleHash = void 0;
// DJB2 hash function
function simpleHash(text) {
    var hash = 5381;
    for (var i = 0; i < text.length; i++) {
        hash = (hash << 5) + hash + text.charCodeAt(i);
    }
    return hash.toString(16);
}
exports.simpleHash = simpleHash;
//# sourceMappingURL=simple-hash.js.map