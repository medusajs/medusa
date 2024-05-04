import { DAL } from "@medusajs/types";
import { OptionalProps, Collection } from "@mikro-orm/core";
import Customer from "./customer";
type OptionalGroupProps = DAL.SoftDeletableEntityDateColumns;
export default class CustomerGroup {
    [OptionalProps]: OptionalGroupProps;
    id: string;
    name: string | null;
    customers: Collection<Customer, object>;
    metadata: Record<string, unknown> | null;
    created_by: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
