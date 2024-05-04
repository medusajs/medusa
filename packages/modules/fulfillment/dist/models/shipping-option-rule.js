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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const shipping_option_1 = __importDefault(require("./shipping-option"));
const DeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "shipping_option_rule",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
const ShippingOptionIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "shipping_option_rule",
    columns: "shipping_option_id",
    where: "deleted_at IS NULL",
});
let ShippingOptionRule = class ShippingOptionRule {
    constructor() {
        this.value = null;
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "sorul");
        this.shipping_option_id ?? (this.shipping_option_id = this.shipping_option?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "sorul");
        this.shipping_option_id ?? (this.shipping_option_id = this.shipping_option?.id);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], ShippingOptionRule.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], ShippingOptionRule.prototype, "attribute", void 0);
__decorate([
    (0, core_1.Enum)({
        items: () => Object.values(utils_1.RuleOperator),
        columnType: "text",
    }),
    __metadata("design:type", Object)
], ShippingOptionRule.prototype, "operator", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], ShippingOptionRule.prototype, "value", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => shipping_option_1.default, {
        type: "text",
        mapToPk: true,
        fieldName: "shipping_option_id",
        onDelete: "cascade",
    }),
    ShippingOptionIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], ShippingOptionRule.prototype, "shipping_option_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => shipping_option_1.default, {
        persist: false,
    }),
    __metadata("design:type", shipping_option_1.default)
], ShippingOptionRule.prototype, "shipping_option", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ShippingOptionRule.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ShippingOptionRule.prototype, "updated_at", void 0);
__decorate([
    DeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], ShippingOptionRule.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingOptionRule.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingOptionRule.prototype, "onInit", null);
ShippingOptionRule = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], ShippingOptionRule);
exports.default = ShippingOptionRule;
