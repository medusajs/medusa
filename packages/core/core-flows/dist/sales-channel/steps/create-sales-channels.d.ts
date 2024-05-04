import { CreateSalesChannelDTO } from "@medusajs/types";
interface StepInput {
    data: CreateSalesChannelDTO[];
}
export declare const createSalesChannelsStepId = "create-sales-channels";
export declare const createSalesChannelsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").SalesChannelDTO[]>;
export {};
