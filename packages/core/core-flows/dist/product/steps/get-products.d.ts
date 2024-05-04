type StepInput = {
    ids: string[];
};
export declare const getProductsStepId = "get-products";
export declare const getProductsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").ProductDTO[]>;
export {};
