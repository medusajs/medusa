interface StepInput {
    variantIds: string[];
}
export declare const validateVariantsExistStepId = "validate-variants-exist";
export declare const validateVariantsExistStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, string[]>;
export {};
