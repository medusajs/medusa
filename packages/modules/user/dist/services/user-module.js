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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const joiner_config_1 = require("../joiner-config");
const _models_1 = require("../models");
const generateMethodForModels = [_models_1.Invite];
class UserModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(_models_1.User, generateMethodForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    constructor({ userService, inviteService, baseRepository }, moduleDeclaration) {
        // @ts-ignore
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.userService_ = userService;
        this.inviteService_ = inviteService.withModuleOptions(this.moduleDeclaration);
    }
    async validateInviteToken(token, sharedContext = {}) {
        const invite = await this.inviteService_.validateInviteToken(token, sharedContext);
        return await this.baseRepository_.serialize(invite, {
            populate: true,
        });
    }
    async refreshInviteTokens(inviteIds, sharedContext = {}) {
        const invites = await this.refreshInviteTokens_(inviteIds, sharedContext);
        sharedContext.messageAggregator?.saveRawMessageData(invites.map((invite) => ({
            eventName: utils_1.UserEvents.invite_token_generated,
            metadata: {
                service: this.constructor.name,
                action: "token_generated",
                object: "invite",
            },
            data: { id: invite.id },
        })));
        return await this.baseRepository_.serialize(invites, {
            populate: true,
        });
    }
    async refreshInviteTokens_(inviteIds, sharedContext = {}) {
        return await this.inviteService_.refreshInviteTokens(inviteIds, sharedContext);
    }
    async create(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const users = await this.userService_.create(input, sharedContext);
        const serializedUsers = await this.baseRepository_.serialize(users, {
            populate: true,
        });
        sharedContext.messageAggregator?.saveRawMessageData(users.map((user) => ({
            eventName: utils_1.UserEvents.created,
            metadata: {
                service: this.constructor.name,
                action: utils_1.CommonEvents.CREATED,
                object: "user",
            },
            data: { id: user.id },
        })));
        return Array.isArray(data) ? serializedUsers : serializedUsers[0];
    }
    async update(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const updatedUsers = await this.userService_.update(input, sharedContext);
        const serializedUsers = await this.baseRepository_.serialize(updatedUsers, {
            populate: true,
        });
        sharedContext.messageAggregator?.saveRawMessageData(updatedUsers.map((user) => ({
            eventName: utils_1.UserEvents.updated,
            metadata: {
                service: this.constructor.name,
                action: utils_1.CommonEvents.UPDATED,
                object: "user",
            },
            data: { id: user.id },
        })));
        return Array.isArray(data) ? serializedUsers : serializedUsers[0];
    }
    async createInvites(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const invites = await this.createInvites_(input, sharedContext);
        const serializedInvites = await this.baseRepository_.serialize(invites, {
            populate: true,
        });
        sharedContext.messageAggregator?.saveRawMessageData(invites.map((invite) => ({
            eventName: utils_1.UserEvents.invite_created,
            metadata: {
                service: this.constructor.name,
                action: utils_1.CommonEvents.CREATED,
                object: "invite",
            },
            data: { id: invite.id },
        })));
        sharedContext.messageAggregator?.saveRawMessageData(invites.map((invite) => ({
            eventName: utils_1.UserEvents.invite_token_generated,
            metadata: {
                service: this.constructor.name,
                action: "token_generated",
                object: "invite",
            },
            data: { id: invite.id },
        })));
        return Array.isArray(data) ? serializedInvites : serializedInvites[0];
    }
    async createInvites_(data, sharedContext = {}) {
        const toCreate = data.map((invite) => {
            return {
                ...invite,
                expires_at: new Date(),
                token: "placeholder",
            };
        });
        return await this.inviteService_.create(toCreate, sharedContext);
    }
    async updateInvites(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const updatedInvites = await this.inviteService_.update(input, sharedContext);
        const serializedInvites = await this.baseRepository_.serialize(updatedInvites, {
            populate: true,
        });
        sharedContext.messageAggregator?.saveRawMessageData(serializedInvites.map((invite) => ({
            eventName: utils_1.UserEvents.invite_updated,
            metadata: {
                service: this.constructor.name,
                action: utils_1.CommonEvents.UPDATED,
                object: "invite",
            },
            data: { id: invite.id },
        })));
        return Array.isArray(data) ? serializedInvites : serializedInvites[0];
    }
}
exports.default = UserModuleService;
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserModuleService.prototype, "validateInviteToken", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    (0, utils_1.EmitEvents)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], UserModuleService.prototype, "refreshInviteTokens", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], UserModuleService.prototype, "refreshInviteTokens_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    (0, utils_1.EmitEvents)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserModuleService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    (0, utils_1.EmitEvents)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserModuleService.prototype, "update", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    (0, utils_1.EmitEvents)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserModuleService.prototype, "createInvites", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], UserModuleService.prototype, "createInvites_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    (0, utils_1.EmitEvents)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserModuleService.prototype, "updateInvites", null);
