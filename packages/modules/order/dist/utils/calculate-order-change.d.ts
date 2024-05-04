import { OrderSummaryDTO } from "@medusajs/types";
import { ActionTypeDefinition, InternalOrderChangeEvent, OrderChangeEvent, OrderTransaction, VirtualOrder } from "../types";
export declare class OrderChangeProcessing {
    private static typeDefinition;
    private static defaultConfig;
    private order;
    private transactions;
    private actions;
    private actionsProcessed;
    private groupTotal;
    private summary;
    static registerActionType(key: string, type: ActionTypeDefinition): void;
    constructor({ order, transactions, actions, }: {
        order: VirtualOrder;
        transactions: OrderTransaction[];
        actions: InternalOrderChangeEvent[];
    });
    private isEventActive;
    private isEventDone;
    private isEventPending;
    processActions(): void;
    private processAction_;
    private resolveReferences;
    private resolveGroup;
    getSummary(): OrderSummaryDTO;
    getCurrentOrder(): VirtualOrder;
}
export declare function calculateOrderChange({ order, transactions, actions, }: {
    order: VirtualOrder;
    transactions?: OrderTransaction[];
    actions?: OrderChangeEvent[];
}): {
    summary: OrderSummaryDTO;
    order: VirtualOrder;
};
