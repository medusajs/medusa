import { WorkflowArguments } from "@medusajs/workflows-sdk";
type HandlerInput = {
    productVariants: {
        id: string;
    }[];
};
export declare function removeProductVariants({ container, data, }: WorkflowArguments<HandlerInput>): Promise<void>;
export declare namespace removeProductVariants {
    var aliases: {
        productVariants: string;
    };
}
export {};
