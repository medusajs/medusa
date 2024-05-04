export default class ApiKey {
    id: string;
    token: string;
    salt: string;
    redacted: string;
    title: string;
    type: "publishable" | "secret";
    last_used_at: Date | null;
    created_by: string;
    created_at: Date;
    revoked_by: string | null;
    revoked_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
