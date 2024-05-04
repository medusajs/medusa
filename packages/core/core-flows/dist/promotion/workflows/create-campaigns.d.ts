import { CampaignDTO, CreateCampaignDTO } from "@medusajs/types";
type WorkflowInput = {
    campaignsData: CreateCampaignDTO[];
};
export declare const createCampaignsWorkflowId = "create-campaigns";
export declare const createCampaignsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, CampaignDTO[], Record<string, Function>>;
export {};
