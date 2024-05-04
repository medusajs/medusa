import { CreatePromotionDTO, PromotionDTO } from "@medusajs/types";
type WorkflowInput = {
    promotionsData: CreatePromotionDTO[];
};
export declare const createPromotionsWorkflowId = "create-promotions";
export declare const createPromotionsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, PromotionDTO[], Record<string, Function>>;
export {};
