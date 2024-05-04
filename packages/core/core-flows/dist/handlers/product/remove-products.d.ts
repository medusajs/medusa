import { WorkflowArguments } from "@medusajs/workflows-sdk";
type HandlerInput = {
    products: {
        id: string;
    }[];
};
export declare function removeProducts({ container, data, }: WorkflowArguments<HandlerInput>): Promise<void>;
export declare namespace removeProducts {
    var aliases: {
        products: string;
    };
}
export {};
