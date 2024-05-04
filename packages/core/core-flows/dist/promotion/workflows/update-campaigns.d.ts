import { CampaignDTO, UpdateCampaignDTO } from "@medusajs/types";
type WorkflowInput = {
    campaignsData: UpdateCampaignDTO[];
};
export declare const updateCampaignsWorkflowId = "update-campaigns";
export declare const updateCampaignsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, CampaignDTO[], Record<string, Function>>;
export {};
