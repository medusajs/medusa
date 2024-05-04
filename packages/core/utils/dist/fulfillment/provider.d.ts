import { IFulfillmentProvider } from "@medusajs/types";
export declare class AbstractFulfillmentProviderService implements IFulfillmentProvider {
    static identifier: string;
    static _isFulfillmentService: boolean;
    static isFulfillmentService(obj: any): any;
    getIdentifier(): any;
    getFulfillmentOptions(): Promise<Record<string, unknown>[]>;
    validateFulfillmentData(optionData: any, data: any, context: any): Promise<any>;
    validateOption(data: any): Promise<boolean>;
    canCalculate(data: any): Promise<void>;
    calculatePrice(optionData: any, data: any, cart: any): Promise<void>;
    createFulfillment(data: any, items: any, order: any, fulfillment: any): Promise<any>;
    cancelFulfillment(fulfillment: any): Promise<any>;
    getFulfillmentDocuments(data: any): Promise<never[]>;
    createReturnFulfillment(fromData: any): Promise<any>;
    getReturnDocuments(data: any): Promise<never[]>;
    getShipmentDocuments(data: any): Promise<never[]>;
    retrieveDocuments(fulfillmentData: any, documentType: any): Promise<void>;
}
