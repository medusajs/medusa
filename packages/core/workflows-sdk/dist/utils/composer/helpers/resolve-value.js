"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveValue = void 0;
const utils_1 = require("@medusajs/utils");
async function resolveProperty(property, transactionContext) {
    const { invoke: invokeRes } = transactionContext;
    if (property?.__type === utils_1.OrchestrationUtils.SymbolInputReference) {
        return transactionContext.payload;
    }
    else if (property?.__type === utils_1.OrchestrationUtils.SymbolWorkflowStepTransformer) {
        return await property.__resolver(transactionContext);
    }
    else if (property?.__type === utils_1.OrchestrationUtils.SymbolWorkflowHook) {
        return await property.__value(transactionContext);
    }
    else if (property?.__type === utils_1.OrchestrationUtils.SymbolWorkflowStep) {
        const output = invokeRes[property.__step__]?.output ?? invokeRes[property.__step__];
        if (output?.__type === utils_1.OrchestrationUtils.SymbolWorkflowStepResponse) {
            return output.output;
        }
        return output;
    }
    else if (property?.__type === utils_1.OrchestrationUtils.SymbolWorkflowStepResponse) {
        return property.output;
    }
    else {
        return property;
    }
}
/**
 * @internal
 */
async function resolveValue(input, transactionContext) {
    const unwrapInput = async (inputTOUnwrap, parentRef) => {
        if (inputTOUnwrap == null) {
            return inputTOUnwrap;
        }
        if (Array.isArray(inputTOUnwrap)) {
            return await (0, utils_1.promiseAll)(inputTOUnwrap.map((i) => resolveValue(i, transactionContext)));
        }
        if (typeof inputTOUnwrap !== "object") {
            return inputTOUnwrap;
        }
        for (const key of Object.keys(inputTOUnwrap)) {
            parentRef[key] = await resolveProperty(inputTOUnwrap[key], transactionContext);
            if (typeof parentRef[key] === "object") {
                await unwrapInput(parentRef[key], parentRef[key]);
            }
        }
        return parentRef;
    };
    const copiedInput = input?.__type === utils_1.OrchestrationUtils.SymbolWorkflowWorkflowData
        ? (0, utils_1.deepCopy)(input.output)
        : (0, utils_1.deepCopy)(input);
    const result = copiedInput?.__type
        ? await resolveProperty(copiedInput, transactionContext)
        : await unwrapInput(copiedInput, {});
    return result && JSON.parse(JSON.stringify(result));
}
exports.resolveValue = resolveValue;
//# sourceMappingURL=resolve-value.js.map