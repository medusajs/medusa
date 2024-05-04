"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const scrypt_kdf_1 = __importDefault(require("scrypt-kdf"));
class EmailPasswordProvider extends utils_1.AbstractAuthModuleProvider {
    constructor({ authUserService }) {
        super(arguments[0], {
            provider: EmailPasswordProvider.PROVIDER,
            displayName: EmailPasswordProvider.DISPLAY_NAME,
        });
        this.authUserSerivce_ = authUserService;
    }
    getHashConfig() {
        const scopeConfig = this.scopeConfig_.hashConfig;
        const defaultHashConfig = { logN: 15, r: 8, p: 1 };
        // Return custom defined hash config or default hash parameters
        return scopeConfig ?? defaultHashConfig;
    }
    async authenticate(userData) {
        const { email, password } = userData.body;
        if (!password || !(0, utils_1.isString)(password)) {
            return {
                success: false,
                error: "Password should be a string",
            };
        }
        if (!email || !(0, utils_1.isString)(email)) {
            return {
                success: false,
                error: "Email should be a string",
            };
        }
        let authUser;
        try {
            authUser = await this.authUserSerivce_.retrieveByProviderAndEntityId(email, EmailPasswordProvider.PROVIDER);
        }
        catch (error) {
            if (error.type === utils_1.MedusaError.Types.NOT_FOUND) {
                const password_hash = await scrypt_kdf_1.default.kdf(password, this.getHashConfig());
                const [createdAuthUser] = await this.authUserSerivce_.create([
                    {
                        entity_id: email,
                        provider: EmailPasswordProvider.PROVIDER,
                        scope: this.scope_,
                        provider_metadata: {
                            password: password_hash.toString("base64"),
                        },
                    },
                ]);
                return {
                    success: true,
                    authUser: JSON.parse(JSON.stringify(createdAuthUser)),
                };
            }
            return { success: false, error: error.message };
        }
        const password_hash = authUser.provider_metadata?.password;
        if ((0, utils_1.isString)(password_hash)) {
            const buf = Buffer.from(password_hash, "base64");
            const success = await scrypt_kdf_1.default.verify(buf, password);
            if (success) {
                delete authUser.provider_metadata.password;
                return { success, authUser: JSON.parse(JSON.stringify(authUser)) };
            }
        }
        return {
            success: false,
            error: "Invalid email or password",
        };
    }
}
EmailPasswordProvider.PROVIDER = "emailpass";
EmailPasswordProvider.DISPLAY_NAME = "Email/Password Authentication";
exports.default = EmailPasswordProvider;
