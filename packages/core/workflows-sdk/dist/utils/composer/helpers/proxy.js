"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxify = void 0;
const transform_1 = require("../transform");
const utils_1 = require("@medusajs/utils");
const resolve_value_1 = require("./resolve-value");
function proxify(obj) {
    return new Proxy(obj, {
        get(target, prop) {
            if (prop in target) {
                return target[prop];
            }
            return (0, transform_1.transform)(target[prop], async function (input, context) {
                const { invoke } = context;
                let output = target.__type === utils_1.OrchestrationUtils.SymbolInputReference ||
                    target.__type === utils_1.OrchestrationUtils.SymbolWorkflowStepTransformer
                    ? target
                    : invoke?.[obj.__step__]?.output;
                output = await (0, resolve_value_1.resolveValue)(output, context);
                output = output?.[prop];
                return output && JSON.parse(JSON.stringify(output));
            });
        },
    });
}
exports.proxify = proxify;
//# sourceMappingURL=proxy.js.map