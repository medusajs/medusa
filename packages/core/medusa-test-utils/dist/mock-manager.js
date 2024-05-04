"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    connection: {
        getMetadata: function (target) {
            var _a;
            return ((_a = target["metadata"]) !== null && _a !== void 0 ? _a : {
                columns: [],
            });
        },
    },
    getRepository: function (repo) {
        return repo;
    },
    withRepository: function (repo) {
        if (repo) {
            return Object.assign(repo, { manager: this });
        }
        return repo;
    },
    transaction: function (isolationOrCb, cb) {
        if (typeof isolationOrCb === "string") {
            return cb(this);
        }
        else {
            return isolationOrCb(this);
        }
    },
};
//# sourceMappingURL=mock-manager.js.map