import { CreateOrderDTO } from "@medusajs/types";
type CreateOrdersStepInput = CreateOrderDTO[];
export declare const createOrdersStepId = "create-orders";
export declare const createOrdersStep: import("@medusajs/workflows-sdk").StepFunction<CreateOrdersStepInput, import("@medusajs/types").OrderDTO[]>;
export {};
