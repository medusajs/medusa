import { CreateOrderDTO, OrderDTO } from "@medusajs/types";
export declare const createOrdersWorkflowId = "create-orders";
export declare const createOrdersWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<CreateOrderDTO, OrderDTO, Record<string, Function>>;
