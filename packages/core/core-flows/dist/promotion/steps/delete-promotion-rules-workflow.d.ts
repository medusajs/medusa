import { RemovePromotionRulesWorkflowDTO } from "@medusajs/types";
export declare const deletePromotionRulesWorkflowStepId = "delete-promotion-rules-workflow";
export declare const deletePromotionRulesWorkflowStep: import("@medusajs/workflows-sdk").StepFunction<RemovePromotionRulesWorkflowDTO, {
    ids: string[];
    object: string;
    deleted: boolean;
}>;
