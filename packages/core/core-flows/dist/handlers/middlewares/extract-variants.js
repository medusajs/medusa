"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractVariants = void 0;
async function extractVariants({ data, }) {
    const variants = data.object.reduce((acc, object) => {
        if (object.variants?.length) {
            return acc.concat(object.variants);
        }
        return acc;
    }, []);
    return {
        alias: extractVariants.aliases.output,
        value: {
            variants,
        },
    };
}
exports.extractVariants = extractVariants;
extractVariants.aliases = {
    output: "extractVariantsFromProductOutput",
    object: "object",
};
