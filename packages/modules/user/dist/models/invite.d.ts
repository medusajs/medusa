import { OptionalProps } from "@mikro-orm/core";
import { DAL } from "@medusajs/types";
type OptionalFields = "metadata" | "accepted" | DAL.SoftDeletableEntityDateColumns;
export default class Invite {
    [OptionalProps]: OptionalFields;
    id: string;
    email: string;
    accepted: boolean;
    token: string;
    expires_at: Date;
    metadata: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onInit(): void;
    beforeCreate(): void;
}
export {};
