"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
const helpers_1 = require("./helpers");
const proxy_1 = require("./helpers/proxy");
const utils_1 = require("@medusajs/utils");
function transform(values, ...functions) {
    const ret = {
        __type: utils_1.OrchestrationUtils.SymbolWorkflowStepTransformer,
        __resolver: undefined,
    };
    const returnFn = async function (transactionContext) {
        const allValues = await (0, helpers_1.resolveValue)(values, transactionContext);
        const stepValue = allValues
            ? JSON.parse(JSON.stringify(allValues))
            : allValues;
        let finalResult;
        for (let i = 0; i < functions.length; i++) {
            const fn = functions[i];
            const arg = i === 0 ? stepValue : finalResult;
            finalResult = await fn.apply(fn, [arg, transactionContext]);
        }
        return finalResult;
    };
    const proxyfiedRet = (0, proxy_1.proxify)(ret);
    proxyfiedRet.__resolver = returnFn;
    return proxyfiedRet;
}
exports.transform = transform;
//# sourceMappingURL=transform.js.map