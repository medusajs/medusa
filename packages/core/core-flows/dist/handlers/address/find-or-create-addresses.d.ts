import { AddressDTO } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type AddressesDTO = {
    shipping_address_id?: string;
    shipping_address?: AddressDTO;
    billing_address_id?: string;
    billing_address?: AddressDTO;
};
type HandlerInputData = {
    addresses: AddressesDTO & {
        billing_address?: AddressDTO;
        shipping_address?: AddressDTO;
    };
    region: {
        region_id?: string;
    };
};
declare enum Aliases {
    Addresses = "addresses",
    Region = "region"
}
export declare function findOrCreateAddresses({ container, data, }: WorkflowArguments<HandlerInputData>): Promise<AddressesDTO>;
export declare namespace findOrCreateAddresses {
    var aliases: typeof Aliases;
}
export {};
