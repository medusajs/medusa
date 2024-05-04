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
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const TypeIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "api_key",
    columns: "type",
});
const TokenIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "api_key",
    columns: "token",
    unique: true,
});
let ApiKey = class ApiKey {
    constructor() {
        this.last_used_at = null;
        this.revoked_by = null;
        this.revoked_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "apk");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "apk");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], ApiKey.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    TokenIndex.MikroORMIndex(),
    __metadata("design:type", String)
], ApiKey.prototype, "token", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], ApiKey.prototype, "salt", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], ApiKey.prototype, "redacted", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], ApiKey.prototype, "title", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    (0, core_1.Enum)({ items: ["publishable", "secret"] }),
    TypeIndex.MikroORMIndex(),
    __metadata("design:type", String)
], ApiKey.prototype, "type", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], ApiKey.prototype, "last_used_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], ApiKey.prototype, "created_by", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ApiKey.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], ApiKey.prototype, "revoked_by", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], ApiKey.prototype, "revoked_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiKey.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiKey.prototype, "onInit", null);
ApiKey = __decorate([
    (0, core_1.Entity)()
], ApiKey);
exports.default = ApiKey;
