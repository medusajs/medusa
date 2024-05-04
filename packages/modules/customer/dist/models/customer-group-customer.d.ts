import { DAL } from "@medusajs/types";
import { OptionalProps } from "@mikro-orm/core";
import Customer from "./customer";
import CustomerGroup from "./customer-group";
type OptionalGroupProps = "customer_group" | "customer" | DAL.EntityDateColumns;
export default class CustomerGroupCustomer {
    [OptionalProps]: OptionalGroupProps;
    id: string;
    customer_id: string;
    customer_group_id: string;
    customer: Customer;
    customer_group: CustomerGroup;
    metadata: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    created_by: string | null;
    onCreate(): void;
    onInit(): void;
}
export {};
