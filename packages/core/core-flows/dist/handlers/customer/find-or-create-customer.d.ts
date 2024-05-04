import { WorkflowArguments } from "@medusajs/workflows-sdk";
import { CustomerTypes } from "@medusajs/types";
type CustomerResultDTO = {
    customer?: CustomerTypes.CustomerDTO;
    customer_id?: string;
    email?: string;
};
type HandlerInputData = {
    customer: {
        customer_id?: string;
        email?: string;
    };
};
declare enum Aliases {
    Customer = "customer"
}
export declare function findOrCreateCustomer({ container, context, data, }: WorkflowArguments<HandlerInputData>): Promise<CustomerResultDTO>;
export declare namespace findOrCreateCustomer {
    var aliases: typeof Aliases;
}
export {};
