import { DAL } from "@medusajs/types";
import { OptionalProps } from "@mikro-orm/core";
type SalesChannelOptionalProps = "is_disabled" | DAL.EntityDateColumns;
export default class SalesChannel {
    [OptionalProps]?: SalesChannelOptionalProps;
    id: string;
    name: string;
    description: string | null;
    is_disabled: boolean;
    created_at: Date;
    metadata: Record<string, unknown> | null;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
