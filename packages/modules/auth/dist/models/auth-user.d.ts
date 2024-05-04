import { OptionalProps } from "@mikro-orm/core";
type OptionalFields = "provider_metadata" | "app_metadata" | "user_metadata";
export default class AuthUser {
    [OptionalProps]: OptionalFields;
    id: string;
    entity_id: string;
    provider: string;
    scope: string;
    user_metadata: Record<string, unknown> | null;
    app_metadata: Record<string, unknown>;
    provider_metadata: Record<string, unknown> | null;
    onCreate(): void;
    onInit(): void;
}
export {};
