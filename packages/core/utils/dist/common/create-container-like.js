"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContainerLike = void 0;
function createContainerLike(obj) {
    return {
        resolve: function (key) {
            return obj[key];
        },
    };
}
exports.createContainerLike = createContainerLike;
//# sourceMappingURL=create-container-like.js.map