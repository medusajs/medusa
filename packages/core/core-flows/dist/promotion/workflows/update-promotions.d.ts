import { PromotionDTO, UpdatePromotionDTO } from "@medusajs/types";
type WorkflowInput = {
    promotionsData: UpdatePromotionDTO[];
};
export declare const updatePromotionsWorkflowId = "update-promotions";
export declare const updatePromotionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, PromotionDTO[], Record<string, Function>>;
export {};
