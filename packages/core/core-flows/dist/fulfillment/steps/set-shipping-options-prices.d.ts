import { FulfillmentWorkflow } from "@medusajs/types";
type SetShippingOptionsPricesStepInput = {
    id: string;
    prices?: FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput["prices"];
}[];
export declare const setShippingOptionsPricesStepId = "set-shipping-options-prices-step";
export declare const setShippingOptionsPricesStep: import("@medusajs/workflows-sdk").StepFunction<SetShippingOptionsPricesStepInput, undefined>;
export {};
