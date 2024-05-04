import { CreateSalesChannelDTO } from "@medusajs/types";
interface StepInput {
    data: CreateSalesChannelDTO;
}
export declare const createDefaultSalesChannelStepId = "create-default-sales-channel";
export declare const createDefaultSalesChannelStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").SalesChannelDTO>;
export {};
