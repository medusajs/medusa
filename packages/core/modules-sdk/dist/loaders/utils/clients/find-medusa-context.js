"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMedusaContext = void 0;
const utils_1 = require("@medusajs/utils");
const findMedusaContext = (args) => {
    if (!Array.isArray(args)) {
        return;
    }
    for (let i = args.length; i--;) {
        if (args[i]?.__type === utils_1.MedusaContextType) {
            return args[i];
        }
    }
    return;
};
exports.findMedusaContext = findMedusaContext;
//# sourceMappingURL=find-medusa-context.js.map