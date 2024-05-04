import { AbstractFulfillmentProviderService } from "@medusajs/utils";
export declare class ManualFulfillmentService extends AbstractFulfillmentProviderService {
    static identifier: string;
    constructor();
    getFulfillmentOptions(): Promise<Record<string, unknown>[]>;
    validateFulfillmentData(optionData: Record<string, unknown>, data: Record<string, unknown>, context: Record<string, unknown>): Promise<any>;
    validateOption(data: Record<string, unknown>): Promise<boolean>;
    createFulfillment(): Promise<Record<string, unknown>>;
    cancelFulfillment(fulfillment: Record<string, unknown>): Promise<any>;
}
