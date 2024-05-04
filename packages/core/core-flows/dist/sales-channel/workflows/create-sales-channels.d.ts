import { CreateSalesChannelDTO, SalesChannelDTO } from "@medusajs/types";
type WorkflowInput = {
    salesChannelsData: CreateSalesChannelDTO[];
};
export declare const createSalesChannelsWorkflowId = "create-sales-channels";
export declare const createSalesChannelsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, SalesChannelDTO[], Record<string, Function>>;
export {};
