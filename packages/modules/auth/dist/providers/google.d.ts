import { AuthenticationInput, AuthenticationResponse } from "@medusajs/types";
import { AbstractAuthModuleProvider } from "@medusajs/utils";
import { AuthUserService } from "../services";
type InjectedDependencies = {
    authUserService: AuthUserService;
};
declare class GoogleProvider extends AbstractAuthModuleProvider {
    static PROVIDER: string;
    static DISPLAY_NAME: string;
    protected readonly authUserService_: AuthUserService;
    constructor({ authUserService }: InjectedDependencies);
    authenticate(req: AuthenticationInput): Promise<AuthenticationResponse>;
    validateCallback(req: AuthenticationInput): Promise<AuthenticationResponse>;
    verify_(refreshToken: string): Promise<{
        success: boolean;
        error: any;
        authUser?: undefined;
    } | {
        success: boolean;
        authUser: any;
        error?: undefined;
    }>;
    private validateCallbackToken;
    private getConfigFromScope;
    private originalURL;
    private getProviderConfig;
    private getRedirect;
    private getAuthorizationCodeHandler;
}
export default GoogleProvider;
