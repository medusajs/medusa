"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const util_1 = __importDefault(require("util"));
const types_1 = require("@medusajs/types");
const joiner_config_1 = require("../joiner-config");
const _models_1 = require("../models");
const utils_1 = require("@medusajs/utils");
const scrypt = util_1.default.promisify(crypto_1.default.scrypt);
const generateMethodForModels = [];
class ApiKeyModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(_models_1.ApiKey, generateMethodForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    constructor({ baseRepository, apiKeyService }, moduleDeclaration) {
        // @ts-ignore
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.apiKeyService_ = apiKeyService;
    }
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    async create(data, sharedContext = {}) {
        const [createdApiKeys, generatedTokens] = await this.create_(Array.isArray(data) ? data : [data], sharedContext);
        const serializedResponse = await this.baseRepository_.serialize(createdApiKeys, {
            populate: true,
        });
        // When creating we want to return the raw token, as this will be the only time the user will be able to take note of it for future use.
        const responseWithRawToken = serializedResponse.map((key) => ({
            ...key,
            token: generatedTokens.find((t) => t.hashedToken === key.token)?.rawToken ??
                key.token,
            salt: undefined,
        }));
        return Array.isArray(data) ? responseWithRawToken : responseWithRawToken[0];
    }
    async create_(data, sharedContext = {}) {
        await this.validateCreateApiKeys_(data, sharedContext);
        const normalizedInput = [];
        const generatedTokens = [];
        for (const key of data) {
            let tokenData;
            if (key.type === utils_1.ApiKeyType.PUBLISHABLE) {
                tokenData = ApiKeyModuleService.generatePublishableKey();
            }
            else {
                tokenData = await ApiKeyModuleService.generateSecretKey();
            }
            generatedTokens.push(tokenData);
            normalizedInput.push({
                ...key,
                token: tokenData.hashedToken,
                salt: tokenData.salt,
                redacted: tokenData.redacted,
            });
        }
        const createdApiKeys = await this.apiKeyService_.create(normalizedInput, sharedContext);
        return [createdApiKeys, generatedTokens];
    }
    async upsert(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const forUpdate = input.filter((apiKey) => !!apiKey.id);
        const forCreate = input.filter((apiKey) => !apiKey.id);
        const operations = [];
        if (forCreate.length) {
            const op = async () => {
                const [createdApiKeys, generatedTokens] = await this.create_(forCreate, sharedContext);
                const serializedResponse = await this.baseRepository_.serialize(createdApiKeys, {
                    populate: true,
                });
                return serializedResponse.map((key) => ({
                    ...key,
                    token: generatedTokens.find((t) => t.hashedToken === key.token)
                        ?.rawToken ?? key.token,
                    salt: undefined,
                }));
            };
            operations.push(op());
        }
        if (forUpdate.length) {
            const op = async () => {
                const updateResp = await this.update_(forUpdate, sharedContext);
                return await this.baseRepository_.serialize(updateResp);
            };
            operations.push(op());
        }
        const result = (await (0, utils_1.promiseAll)(operations)).flat();
        return Array.isArray(data) ? result : result[0];
    }
    async update(idOrSelector, data, sharedContext = {}) {
        let normalizedInput = await this.normalizeUpdateInput_(idOrSelector, data, sharedContext);
        const updatedApiKeys = await this.update_(normalizedInput, sharedContext);
        const serializedResponse = await this.baseRepository_.serialize(updatedApiKeys.map(omitToken), {
            populate: true,
        });
        return (0, utils_1.isString)(idOrSelector) ? serializedResponse[0] : serializedResponse;
    }
    async update_(normalizedInput, sharedContext = {}) {
        const updateRequest = normalizedInput.map((k) => ({
            id: k.id,
            title: k.title,
        }));
        const updatedApiKeys = await this.apiKeyService_.update(updateRequest, sharedContext);
        return updatedApiKeys;
    }
    async retrieve(id, config, sharedContext) {
        const apiKey = await this.apiKeyService_.retrieve(id, config, sharedContext);
        return await this.baseRepository_.serialize(omitToken(apiKey), {
            populate: true,
        });
    }
    async list(filters, config, sharedContext) {
        const apiKeys = await this.apiKeyService_.list(filters, config, sharedContext);
        return await this.baseRepository_.serialize(apiKeys.map(omitToken), {
            populate: true,
        });
    }
    async listAndCount(filters, config, sharedContext) {
        const [apiKeys, count] = await this.apiKeyService_.listAndCount(filters, config, sharedContext);
        return [
            await this.baseRepository_.serialize(apiKeys.map(omitToken), {
                populate: true,
            }),
            count,
        ];
    }
    async revoke(idOrSelector, data, sharedContext = {}) {
        const normalizedInput = await this.normalizeUpdateInput_(idOrSelector, data, sharedContext);
        const revokedApiKeys = await this.revoke_(normalizedInput, sharedContext);
        const serializedResponse = await this.baseRepository_.serialize(revokedApiKeys.map(omitToken), {
            populate: true,
        });
        return (0, utils_1.isString)(idOrSelector) ? serializedResponse[0] : serializedResponse;
    }
    async revoke_(normalizedInput, sharedContext = {}) {
        await this.validateRevokeApiKeys_(normalizedInput);
        const updateRequest = normalizedInput.map((k) => {
            const revokedAt = new Date();
            if (k.revoke_in && k.revoke_in > 0) {
                revokedAt.setSeconds(revokedAt.getSeconds() + k.revoke_in);
            }
            return {
                id: k.id,
                revoked_at: revokedAt,
                revoked_by: k.revoked_by,
            };
        });
        const revokedApiKeys = await this.apiKeyService_.update(updateRequest, sharedContext);
        return revokedApiKeys;
    }
    async authenticate(token, sharedContext = {}) {
        const result = await this.authenticate_(token, sharedContext);
        if (!result) {
            return false;
        }
        const serialized = await this.baseRepository_.serialize(result, {
            populate: true,
        });
        return serialized;
    }
    async authenticate_(token, sharedContext = {}) {
        // Since we only allow up to 2 active tokens, getitng the list and checking each token isn't an issue.
        // We can always filter on the redacted key if we add support for an arbitrary number of tokens.
        const secretKeys = await this.apiKeyService_.list({
            type: utils_1.ApiKeyType.SECRET,
            // If the revoke date is set in the future, it means the key is still valid.
            $or: [
                { revoked_at: { $eq: null } },
                { revoked_at: { $gt: new Date() } },
            ],
        }, { take: null }, sharedContext);
        const matches = await (0, utils_1.promiseAll)(secretKeys.map(async (dbKey) => {
            const hashedInput = await ApiKeyModuleService.calculateHash(token, dbKey.salt);
            if (hashedInput === dbKey.token) {
                return dbKey;
            }
            return undefined;
        }));
        const matchedKeys = matches.filter((match) => !!match);
        if (!matchedKeys.length) {
            return false;
        }
        return matchedKeys[0];
    }
    async validateCreateApiKeys_(data, sharedContext = {}) {
        if (!data.length) {
            return;
        }
        // There can only be 2 secret keys at most, and one has to be with a revoked_at date set, so only 1 can be newly created.
        const secretKeysToCreate = data.filter((k) => k.type === utils_1.ApiKeyType.SECRET);
        if (!secretKeysToCreate.length) {
            return;
        }
        if (secretKeysToCreate.length > 1) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `You can only create one secret key at a time. You tried to create ${secretKeysToCreate.length} secret keys.`);
        }
        // There already is a key that is not set to expire/or it hasn't expired
        const dbSecretKeys = await this.apiKeyService_.list({
            type: utils_1.ApiKeyType.SECRET,
            $or: [
                { revoked_at: { $eq: null } },
                { revoked_at: { $gt: new Date() } },
            ],
        }, { take: null }, sharedContext);
        if (dbSecretKeys.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `You can only have one active secret key a time. Revoke or delete your existing key before creating a new one.`);
        }
    }
    async normalizeUpdateInput_(idOrSelector, data, sharedContext = {}) {
        let normalizedInput = [];
        if ((0, utils_1.isString)(idOrSelector)) {
            normalizedInput = [{ id: idOrSelector, ...data }];
        }
        if ((0, utils_1.isObject)(idOrSelector)) {
            const apiKeys = await this.apiKeyService_.list(idOrSelector, {}, sharedContext);
            normalizedInput = apiKeys.map((apiKey) => ({
                id: apiKey.id,
                ...data,
            }));
        }
        return normalizedInput;
    }
    async validateRevokeApiKeys_(data, sharedContext = {}) {
        if (!data.length) {
            return;
        }
        if (data.some((k) => !k.id)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `You must provide an api key id field when revoking a key.`);
        }
        if (data.some((k) => !k.revoked_by)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `You must provide a revoked_by field when revoking a key.`);
        }
        const revokedApiKeys = await this.apiKeyService_.list({
            id: data.map((k) => k.id),
            type: utils_1.ApiKeyType.SECRET,
            revoked_at: { $ne: null },
        }, {}, sharedContext);
        if (revokedApiKeys.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `There are ${revokedApiKeys.length} secret keys that are already revoked.`);
        }
    }
    // These are public keys, so there is no point hashing them.
    static generatePublishableKey() {
        const token = "pk_" + crypto_1.default.randomBytes(32).toString("hex");
        return {
            rawToken: token,
            hashedToken: token,
            salt: "",
            redacted: redactKey(token),
        };
    }
    static async generateSecretKey() {
        const token = "sk_" + crypto_1.default.randomBytes(32).toString("hex");
        const salt = crypto_1.default.randomBytes(16).toString("hex");
        const hashed = await this.calculateHash(token, salt);
        return {
            rawToken: token,
            hashedToken: hashed,
            salt,
            redacted: redactKey(token),
        };
    }
    static async calculateHash(token, salt) {
        return (await scrypt(token, salt, 64)).toString("hex");
    }
}
exports.default = ApiKeyModuleService;
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyModuleService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyModuleService.prototype, "create_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyModuleService.prototype, "upsert", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyModuleService.prototype, "update", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyModuleService.prototype, "update_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyModuleService.prototype, "retrieve", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyModuleService.prototype, "list", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyModuleService.prototype, "listAndCount", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyModuleService.prototype, "revoke", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyModuleService.prototype, "revoke_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyModuleService.prototype, "authenticate", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyModuleService.prototype, "authenticate_", null);
// We are mutating the object here as what microORM relies on non-enumerable fields for serialization, among other things.
const omitToken = (
// We have to make salt optional before deleting it (and we do want it required in the DB)
key) => {
    key.token = key.type === utils_1.ApiKeyType.SECRET ? "" : key.token;
    delete key.salt;
    return key;
};
const redactKey = (key) => {
    return [key.slice(0, 6), key.slice(-3)].join("***");
};
