import { SalesChannelDTO } from "@medusajs/types";
interface StepInput {
    salesChannelId?: string | null;
}
export declare const findSalesChannelStepId = "find-sales-channel";
export declare const findSalesChannelStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, SalesChannelDTO | null>;
export {};
