import { WorkflowArguments } from "@medusajs/workflows-sdk";
type ProductHandle = string;
type ShippingProfileId = string;
type PartialProduct = {
    handle: string;
    id: string;
};
type HandlerInput = {
    productsHandleShippingProfileIdMap: Map<ProductHandle, ShippingProfileId>;
    products: PartialProduct[];
};
export declare function detachShippingProfileFromProducts({ container, context, data, }: WorkflowArguments<HandlerInput>): Promise<void>;
export declare namespace detachShippingProfileFromProducts {
    var aliases: {
        products: string;
    };
}
export {};
