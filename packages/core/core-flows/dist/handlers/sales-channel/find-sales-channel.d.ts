import { WorkflowArguments } from "@medusajs/workflows-sdk";
type AttachSalesChannelDTO = {
    sales_channel_id?: string;
};
type HandlerInputData = {
    sales_channel: {
        sales_channel_id?: string;
        publishableApiKeyScopes?: {
            sales_channel_ids?: string[];
        };
    };
};
declare enum Aliases {
    SalesChannel = "sales_channel"
}
export declare function findSalesChannel({ container, data, }: WorkflowArguments<HandlerInputData>): Promise<AttachSalesChannelDTO>;
export declare namespace findSalesChannel {
    var aliases: typeof Aliases;
}
export {};
