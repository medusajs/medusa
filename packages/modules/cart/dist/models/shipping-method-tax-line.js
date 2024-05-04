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
const shipping_method_1 = __importDefault(require("./shipping-method"));
const tax_line_1 = __importDefault(require("./tax-line"));
const ShippingMethodIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    name: "IDX_tax_line_shipping_method_id",
    tableName: "cart_shipping_method_tax_line",
    columns: "shipping_method_id",
    where: "deleted_at IS NULL",
}).MikroORMIndex;
const TaxRateIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    name: "IDX_shipping_method_tax_line_tax_rate_id",
    tableName: "cart_shipping_method_tax_line",
    columns: "tax_rate_id",
    where: "deleted_at IS NULL AND tax_rate_id IS NOT NULL",
}).MikroORMIndex;
const DeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "cart_shipping_method_tax_line",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
}).MikroORMIndex;
let ShippingMethodTaxLine = class ShippingMethodTaxLine extends tax_line_1.default {
    constructor() {
        super(...arguments);
        this.tax_rate_id = null;
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "casmtxl");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "casmtxl");
    }
};
__decorate([
    (0, core_1.ManyToOne)({ entity: () => shipping_method_1.default, persist: false }),
    __metadata("design:type", shipping_method_1.default)
], ShippingMethodTaxLine.prototype, "shipping_method", void 0);
__decorate([
    ShippingMethodIdIndex(),
    (0, core_1.ManyToOne)({
        entity: () => shipping_method_1.default,
        columnType: "text",
        fieldName: "shipping_method_id",
        mapToPk: true,
    }),
    __metadata("design:type", String)
], ShippingMethodTaxLine.prototype, "shipping_method_id", void 0);
__decorate([
    TaxRateIdIndex(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], ShippingMethodTaxLine.prototype, "tax_rate_id", void 0);
__decorate([
    DeletedAtIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], ShippingMethodTaxLine.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingMethodTaxLine.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingMethodTaxLine.prototype, "onInit", null);
ShippingMethodTaxLine = __decorate([
    (0, core_1.Entity)({ tableName: "cart_shipping_method_tax_line" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], ShippingMethodTaxLine);
exports.default = ShippingMethodTaxLine;
