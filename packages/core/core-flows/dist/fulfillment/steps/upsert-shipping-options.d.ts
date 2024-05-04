import { FulfillmentWorkflow, ShippingOptionDTO } from "@medusajs/types";
type StepInput = Omit<FulfillmentWorkflow.CreateShippingOptionsWorkflowInput | FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput, "prices">[];
export declare const upsertShippingOptionsStepId = "create-shipping-options-step";
export declare const upsertShippingOptionsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, ShippingOptionDTO[]>;
export {};
