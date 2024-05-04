"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
const utils_1 = require("@medusajs/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _models_1 = require("../models");
// 1 day
const DEFAULT_VALID_INVITE_DURATION = 60 * 60 * 24 * 1000;
class InviteService extends utils_1.ModulesSdkUtils.internalModuleServiceFactory(_models_1.Invite) {
    constructor(container) {
        super(container);
        this.inviteRepository_ = container.inviteRepository;
    }
    withModuleOptions(options) {
        const service = new InviteService(this.__container__);
        service.options_ = options;
        return service;
    }
    getOption(key) {
        if (!this.options_) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.UNEXPECTED_STATE, `Options are not configured for InviteService, call "withModuleOptions" and provide options`);
        }
        return this.options_[key];
    }
    async create(data, context = {}) {
        const data_ = Array.isArray(data) ? data : [data];
        const invites = await super.create(data_, context);
        const expiresIn = this.getValidDuration();
        const updates = invites.map((invite) => {
            return {
                id: invite.id,
                expires_at: new Date().setMilliseconds(new Date().getMilliseconds() + expiresIn),
                token: this.generateToken({ id: invite.id }),
            };
        });
        return await super.update(updates, context);
    }
    async refreshInviteTokens(inviteIds, context = {}) {
        const [invites, count] = await super.listAndCount({ id: inviteIds }, {}, context);
        if (count !== inviteIds.length) {
            const missing = (0, utils_1.arrayDifference)(inviteIds, invites.map((invite) => invite.id));
            if (missing.length > 0) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `The following invites do not exist: ${missing.join(", ")}`);
            }
        }
        const expiresIn = this.getValidDuration();
        const updates = invites.map((invite) => {
            return {
                id: invite.id,
                expires_at: new Date().setMilliseconds(new Date().getMilliseconds() + expiresIn),
                token: this.generateToken({ id: invite.id }),
            };
        });
        return await super.update(updates, context);
    }
    async validateInviteToken(token, context) {
        const decoded = this.validateToken(token);
        const invite = await super.retrieve(decoded.payload.id, {}, context);
        if (invite.expires_at < new Date()) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "The invite has expired");
        }
        return invite;
    }
    generateToken(data) {
        const jwtSecret = this.getOption("jwt_secret");
        const expiresIn = this.getValidDuration() / 1000;
        if (!jwtSecret) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "No jwt_secret was provided in the UserModule's options. Please add one.");
        }
        return jsonwebtoken_1.default.sign(data, jwtSecret, {
            jwtid: crypto.randomUUID(),
            expiresIn,
        });
    }
    getValidDuration() {
        return (parseInt(this.getOption("valid_duration")) ||
            DEFAULT_VALID_INVITE_DURATION);
    }
    validateToken(data) {
        const jwtSecret = this.getOption("jwt_secret");
        if (!jwtSecret) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "No jwt_secret was provided in the UserModule's options. Please add one.");
        }
        return jsonwebtoken_1.default.verify(data, jwtSecret, { complete: true });
    }
}
exports.default = InviteService;
__decorate([
    (0, utils_1.InjectTransactionManager)("inviteRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InviteService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("inviteRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], InviteService.prototype, "refreshInviteTokens", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("inviteRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InviteService.prototype, "validateInviteToken", null);
