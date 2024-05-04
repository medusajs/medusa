"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mikroOrmSoftDeletableFilterOptions = exports.SoftDeletableFilterKey = void 0;
exports.SoftDeletableFilterKey = "softDeletable";
exports.mikroOrmSoftDeletableFilterOptions = {
    name: exports.SoftDeletableFilterKey,
    cond: function (_a) {
        var _b = _a === void 0 ? {} : _a, withDeleted = _b.withDeleted;
        if (withDeleted) {
            return {};
        }
        return {
            deleted_at: null,
        };
    },
    default: true,
    args: false,
};
//# sourceMappingURL=mikro-orm-soft-deletable-filter.js.map