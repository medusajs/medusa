import { FilterableSalesChannelProps, SalesChannelDTO, UpdateSalesChannelDTO } from "@medusajs/types";
type UpdateSalesChannelsStepInput = {
    selector: FilterableSalesChannelProps;
    update: UpdateSalesChannelDTO;
};
export declare const updateSalesChannelsWorkflowId = "update-sales-channels";
export declare const updateSalesChannelsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<UpdateSalesChannelsStepInput, SalesChannelDTO[], Record<string, Function>>;
export {};
