import { AuthProviderScope, AuthenticationResponse } from "@medusajs/types";
export declare abstract class AbstractAuthModuleProvider {
    static PROVIDER: string;
    static DISPLAY_NAME: string;
    protected readonly container_: any;
    protected scopeConfig_: AuthProviderScope;
    protected scope_: string;
    private readonly scopes_;
    get provider(): string;
    get displayName(): string;
    protected constructor({ scopes }: {
        scopes: any;
    }, config: {
        provider: string;
        displayName: string;
    });
    private validateScope;
    withScope(scope: string): any;
    abstract authenticate(data: Record<string, unknown>): Promise<AuthenticationResponse>;
    validateCallback(data: Record<string, unknown>): Promise<AuthenticationResponse>;
}
