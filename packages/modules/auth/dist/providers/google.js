"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const simple_oauth2_1 = require("simple-oauth2");
const url_1 = __importDefault(require("url"));
class GoogleProvider extends utils_1.AbstractAuthModuleProvider {
    constructor({ authUserService }) {
        super(arguments[0], {
            provider: GoogleProvider.PROVIDER,
            displayName: GoogleProvider.DISPLAY_NAME,
        });
        this.authUserService_ = authUserService;
    }
    async authenticate(req) {
        if (req.query?.error) {
            return {
                success: false,
                error: `${req.query.error_description}, read more at: ${req.query.error_uri}`,
            };
        }
        let config;
        try {
            config = await this.getProviderConfig(req);
        }
        catch (error) {
            return { success: false, error: error.message };
        }
        return this.getRedirect(config);
    }
    async validateCallback(req) {
        if (req.query && req.query.error) {
            return {
                success: false,
                error: `${req.query.error_description}, read more at: ${req.query.error_uri}`,
            };
        }
        let config;
        try {
            config = await this.getProviderConfig(req);
        }
        catch (error) {
            return { success: false, error: error.message };
        }
        const code = req.query?.code ?? req.body?.code;
        return await this.validateCallbackToken(code, config);
    }
    // abstractable
    async verify_(refreshToken) {
        const jwtData = jsonwebtoken_1.default.decode(refreshToken, {
            complete: true,
        });
        const entity_id = jwtData.payload.email;
        let authUser;
        try {
            authUser = await this.authUserService_.retrieveByProviderAndEntityId(entity_id, GoogleProvider.PROVIDER);
        }
        catch (error) {
            if (error.type === utils_1.MedusaError.Types.NOT_FOUND) {
                const [createdAuthUser] = await this.authUserService_.create([
                    {
                        entity_id,
                        provider: GoogleProvider.PROVIDER,
                        user_metadata: jwtData.payload,
                        scope: this.scope_,
                    },
                ]);
                authUser = createdAuthUser;
            }
            else {
                return { success: false, error: error.message };
            }
        }
        return {
            success: true,
            authUser,
        };
    }
    // abstractable
    async validateCallbackToken(code, { clientID, callbackURL, clientSecret }) {
        const client = this.getAuthorizationCodeHandler({ clientID, clientSecret });
        const tokenParams = {
            code,
            redirect_uri: callbackURL,
        };
        try {
            const accessToken = await client.getToken(tokenParams);
            const { authUser, success } = await this.verify_(accessToken.token.id_token);
            const { successRedirectUrl } = this.getConfigFromScope();
            return {
                success,
                authUser,
                successRedirectUrl,
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    getConfigFromScope() {
        const config = { ...this.scopeConfig_ };
        if (!config.clientID) {
            throw new Error("Google clientID is required");
        }
        if (!config.clientSecret) {
            throw new Error("Google clientSecret is required");
        }
        if (!config.callbackURL) {
            throw new Error("Google callbackUrl is required");
        }
        return config;
    }
    originalURL(req) {
        const host = req.headers.host;
        const protocol = req.protocol;
        const path = req.url || "";
        return protocol + "://" + host + path;
    }
    async getProviderConfig(req) {
        const config = this.getConfigFromScope();
        const callbackURL = config.callbackURL;
        const parsedCallbackUrl = !url_1.default.parse(callbackURL).protocol
            ? url_1.default.resolve(this.originalURL(req), callbackURL)
            : callbackURL;
        return { ...config, callbackURL: parsedCallbackUrl };
    }
    // Abstractable
    getRedirect({ clientID, callbackURL, clientSecret }) {
        const client = this.getAuthorizationCodeHandler({ clientID, clientSecret });
        const location = client.authorizeURL({
            redirect_uri: callbackURL,
            scope: "email profile",
        });
        return { success: true, location };
    }
    getAuthorizationCodeHandler({ clientID, clientSecret, }) {
        const config = {
            client: {
                id: clientID,
                secret: clientSecret,
            },
            auth: {
                // TODO: abstract to not be google specific
                authorizeHost: "https://accounts.google.com",
                authorizePath: "/o/oauth2/v2/auth",
                tokenHost: "https://www.googleapis.com",
                tokenPath: "/oauth2/v4/token",
            },
        };
        return new simple_oauth2_1.AuthorizationCode(config);
    }
}
GoogleProvider.PROVIDER = "google";
GoogleProvider.DISPLAY_NAME = "Google Authentication";
exports.default = GoogleProvider;
