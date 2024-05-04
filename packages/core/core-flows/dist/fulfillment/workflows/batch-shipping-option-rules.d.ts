import { BatchWorkflowInput, BatchWorkflowOutput, CreateShippingOptionRuleDTO, ShippingOptionRuleDTO, UpdateShippingOptionRuleDTO } from "@medusajs/types";
export declare const batchShippingOptionRulesWorkflowId = "batch-shipping-option-rules";
export declare const batchShippingOptionRulesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<BatchWorkflowInput<CreateShippingOptionRuleDTO, UpdateShippingOptionRuleDTO>, BatchWorkflowOutput<ShippingOptionRuleDTO>, Record<string, Function>>;
