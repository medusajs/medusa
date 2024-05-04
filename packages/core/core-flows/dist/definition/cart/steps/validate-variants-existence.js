"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVariantsExistStep = exports.validateVariantsExistStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.validateVariantsExistStepId = "validate-variants-exist";
exports.validateVariantsExistStep = (0, workflows_sdk_1.createStep)(exports.validateVariantsExistStepId, async (data, { container }) => {
    const productModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const variants = await productModuleService.listVariants({ id: data.variantIds }, { select: ["id"] });
    const variantIdToData = new Set(variants.map((v) => v.id));
    const notFoundVariants = new Set([...data.variantIds].filter((x) => !variantIdToData.has(x)));
    if (notFoundVariants.size) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Variants with IDs ${[...notFoundVariants].join(", ")} do not exist`);
    }
    return new workflows_sdk_1.StepResponse(Array.from(variants.map((v) => v.id)));
});
