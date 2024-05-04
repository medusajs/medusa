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
let PaymentMethodToken = class PaymentMethodToken {
    constructor() {
        this.data = null;
        this.type_detail = null;
        this.description_detail = null;
        this.deleted_at = null;
        this.metadata = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "paymttok");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "paymttok");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], PaymentMethodToken.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], PaymentMethodToken.prototype, "provider_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], PaymentMethodToken.prototype, "data", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], PaymentMethodToken.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], PaymentMethodToken.prototype, "type_detail", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], PaymentMethodToken.prototype, "description_detail", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PaymentMethodToken.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PaymentMethodToken.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
        index: "IDX_payment_metod_token_deleted_at",
    }),
    __metadata("design:type", Object)
], PaymentMethodToken.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], PaymentMethodToken.prototype, "metadata", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentMethodToken.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentMethodToken.prototype, "onInit", null);
PaymentMethodToken = __decorate([
    (0, core_1.Entity)({ tableName: "payment_method_token" })
], PaymentMethodToken);
exports.default = PaymentMethodToken;
