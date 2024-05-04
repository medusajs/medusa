import { OptionalProps } from "@mikro-orm/core";
import { DAL } from "@medusajs/types";
type OptionalFields = "first_name" | "last_name" | "metadata" | "avatar_url" | DAL.SoftDeletableEntityDateColumns;
export default class User {
    [OptionalProps]?: OptionalFields;
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    avatar_url: string | null;
    metadata: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
