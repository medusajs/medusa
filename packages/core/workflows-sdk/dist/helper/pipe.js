"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipe = void 0;
const merge_data_1 = require("./merge-data");
function pipe(input, ...functions) {
    // Apply the aggregator just before the last handler
    if ((input.merge || input.mergeAlias || input.mergeFrom) &&
        functions.length) {
        const handler = functions.pop();
        functions.push((0, merge_data_1.mergeData)(input.mergeFrom, input.mergeAlias), handler);
    }
    return async ({ container, payload, invoke, compensate, metadata, transaction, context, }) => {
        let data = {};
        const original = {
            invoke: invoke ?? {},
            compensate: compensate ?? {},
        };
        if (input.inputAlias) {
            Object.assign(original.invoke, { [input.inputAlias]: payload });
        }
        const dataKeys = ["invoke", "compensate"];
        for (const key of dataKeys) {
            if (!input[key]) {
                continue;
            }
            if (!Array.isArray(input[key])) {
                input[key] = [input[key]];
            }
            for (const action of input[key]) {
                if (action.alias) {
                    data[action.alias] = original[key][action.from];
                }
                else {
                    data[action.from] = original[key][action.from];
                }
            }
        }
        let finalResult;
        for (const fn of functions) {
            let result = await fn({
                container,
                payload,
                data,
                metadata,
                context: context,
            });
            if (Array.isArray(result)) {
                for (const action of result) {
                    if (action?.alias) {
                        data[action.alias] = action.value;
                    }
                }
            }
            else if (result &&
                "alias" in result) {
                if (result.alias) {
                    data[result.alias] = result.value;
                }
                else {
                    data = result.value;
                }
            }
            finalResult = result;
        }
        if (typeof input.onComplete === "function") {
            const dataCopy = JSON.parse(JSON.stringify(data));
            await input.onComplete({
                container,
                payload,
                data: dataCopy,
                metadata,
                transaction,
                context: context,
            });
        }
        return finalResult;
    };
}
exports.pipe = pipe;
//# sourceMappingURL=pipe.js.map