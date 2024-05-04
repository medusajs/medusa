import { ProductTypes, WorkflowTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type HandlerInput = {
    ids: string[];
    config?: WorkflowTypes.CommonWorkflow.WorkflowInputConfig;
};
export declare function listProducts({ container, context, data, }: WorkflowArguments<HandlerInput>): Promise<ProductTypes.ProductDTO[]>;
export declare namespace listProducts {
    var aliases: {
        ids: string;
    };
}
export {};
