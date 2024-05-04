import { FilterableSalesChannelProps, UpdateSalesChannelDTO } from "@medusajs/types";
type UpdateSalesChannelsStepInput = {
    selector: FilterableSalesChannelProps;
    update: UpdateSalesChannelDTO;
};
export declare const updateSalesChannelsStepId = "update-sales-channels";
export declare const updateSalesChannelsStep: import("@medusajs/workflows-sdk").StepFunction<UpdateSalesChannelsStepInput, import("@medusajs/types").SalesChannelDTO[]>;
export {};
