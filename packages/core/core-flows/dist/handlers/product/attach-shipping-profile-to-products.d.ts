import { WorkflowArguments } from "@medusajs/workflows-sdk";
type ProductHandle = string;
type ShippingProfileId = string;
type PartialProduct = {
    handle: string;
    id: string;
};
type handlerInput = {
    productsHandleShippingProfileIdMap: Map<ProductHandle, ShippingProfileId>;
    products: PartialProduct[];
};
export declare function attachShippingProfileToProducts({ container, context, data, }: WorkflowArguments<handlerInput>): Promise<void>;
export declare namespace attachShippingProfileToProducts {
    var aliases: {
        products: string;
    };
}
export {};
