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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const utils_1 = require("@medusajs/utils");
const inviteEmailIndexName = "IDX_invite_email";
const inviteEmailIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: inviteEmailIndexName,
    tableName: "invite",
    columns: "email",
    where: "deleted_at IS NULL",
    unique: true,
}).expression;
const inviteTokenIndexName = "IDX_invite_token";
const inviteTokenIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: inviteTokenIndexName,
    tableName: "invite",
    columns: "token",
    where: "deleted_at IS NULL",
}).expression;
const inviteDeletedAtIndexName = "IDX_invite_deleted_at";
const inviteDeletedAtIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: inviteDeletedAtIndexName,
    tableName: "invite",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
}).expression;
let Invite = class Invite {
    constructor() {
        this.accepted = false;
        this.metadata = null;
        this.deleted_at = null;
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "invite");
    }
    beforeCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "invite");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Invite.prototype, "id", void 0);
__decorate([
    (0, core_1.Index)({
        name: inviteEmailIndexName,
        expression: inviteEmailIndexStatement,
    }),
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Invite.prototype, "email", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean" }),
    __metadata("design:type", Boolean)
], Invite.prototype, "accepted", void 0);
__decorate([
    (0, core_1.Index)({
        name: inviteTokenIndexName,
        expression: inviteTokenIndexStatement,
    }),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Invite.prototype, "token", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz" }),
    __metadata("design:type", Date)
], Invite.prototype, "expires_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Invite.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Invite.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Invite.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Index)({
        name: inviteDeletedAtIndexName,
        expression: inviteDeletedAtIndexStatement,
    }),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], Invite.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Invite.prototype, "onInit", null);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Invite.prototype, "beforeCreate", null);
Invite = __decorate([
    (0, core_1.Entity)({ tableName: "invite" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], Invite);
exports.default = Invite;
