import { AuthenticationInput, AuthenticationResponse } from "@medusajs/types";
import { AbstractAuthModuleProvider } from "@medusajs/utils";
import { AuthUserService } from "../services";
declare class EmailPasswordProvider extends AbstractAuthModuleProvider {
    static PROVIDER: string;
    static DISPLAY_NAME: string;
    protected readonly authUserSerivce_: AuthUserService;
    constructor({ authUserService }: {
        authUserService: AuthUserService;
    });
    private getHashConfig;
    authenticate(userData: AuthenticationInput): Promise<AuthenticationResponse>;
}
export default EmailPasswordProvider;
