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
const fulfillment_1 = __importDefault(require("./fulfillment"));
const fulfillment_provider_1 = __importDefault(require("./fulfillment-provider"));
const service_zone_1 = __importDefault(require("./service-zone"));
const shipping_option_rule_1 = __importDefault(require("./shipping-option-rule"));
const shipping_option_type_1 = __importDefault(require("./shipping-option-type"));
const shipping_profile_1 = __importDefault(require("./shipping-profile"));
const DeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "shipping_option",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
const ServiceZoneIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "shipping_option",
    columns: "service_zone_id",
    where: "deleted_at IS NULL",
});
const ShippingProfileIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "shipping_option",
    columns: "shipping_profile_id",
    where: "deleted_at IS NULL",
});
const FulfillmentProviderIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "shipping_option",
    columns: "provider_id",
    where: "deleted_at IS NULL",
});
const ShippingOptionTypeIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "shipping_option",
    columns: "shipping_option_type_id",
    where: "deleted_at IS NULL",
});
let ShippingOption = class ShippingOption {
    constructor() {
        this.shipping_option_type_id = null;
        this.data = null;
        this.metadata = null;
        this.rules = new core_1.Collection(this);
        this.fulfillments = new core_1.Collection(this);
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "so");
        this.shipping_option_type_id ?? (this.shipping_option_type_id = this.type?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "so");
        this.shipping_option_type_id ?? (this.shipping_option_type_id = this.type?.id);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], ShippingOption.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], ShippingOption.prototype, "name", void 0);
__decorate([
    (0, core_1.Enum)({
        items: () => utils_1.ShippingOptionPriceType,
        default: utils_1.ShippingOptionPriceType.FLAT,
    }),
    __metadata("design:type", String)
], ShippingOption.prototype, "price_type", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => service_zone_1.default, {
        type: "text",
        fieldName: "service_zone_id",
        mapToPk: true,
        onDelete: "cascade",
    }),
    ServiceZoneIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], ShippingOption.prototype, "service_zone_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => shipping_profile_1.default, {
        type: "text",
        fieldName: "shipping_profile_id",
        mapToPk: true,
        nullable: true,
        onDelete: "set null",
    }),
    ShippingProfileIdIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], ShippingOption.prototype, "shipping_profile_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => fulfillment_provider_1.default, {
        type: "text",
        fieldName: "provider_id",
        mapToPk: true,
        nullable: true,
    }),
    FulfillmentProviderIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], ShippingOption.prototype, "provider_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", persist: false }),
    ShippingOptionTypeIdIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], ShippingOption.prototype, "shipping_option_type_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], ShippingOption.prototype, "data", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], ShippingOption.prototype, "metadata", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => service_zone_1.default, { persist: false }),
    __metadata("design:type", service_zone_1.default)
], ShippingOption.prototype, "service_zone", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => shipping_profile_1.default, {
        persist: false,
    }),
    __metadata("design:type", Object)
], ShippingOption.prototype, "shipping_profile", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => fulfillment_provider_1.default, {
        persist: false,
    }),
    __metadata("design:type", Object)
], ShippingOption.prototype, "provider", void 0);
__decorate([
    (0, core_1.OneToOne)(() => shipping_option_type_1.default, (so) => so.shipping_option, {
        owner: true,
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
        orphanRemoval: true,
        fieldName: "shipping_option_type_id",
        onDelete: "cascade",
    }),
    __metadata("design:type", shipping_option_type_1.default)
], ShippingOption.prototype, "type", void 0);
__decorate([
    (0, core_1.OneToMany)(() => shipping_option_rule_1.default, "shipping_option", {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
        orphanRemoval: true,
    }),
    __metadata("design:type", Object)
], ShippingOption.prototype, "rules", void 0);
__decorate([
    (0, core_1.OneToMany)(() => fulfillment_1.default, (fulfillment) => fulfillment.shipping_option),
    __metadata("design:type", Object)
], ShippingOption.prototype, "fulfillments", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ShippingOption.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ShippingOption.prototype, "updated_at", void 0);
__decorate([
    DeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], ShippingOption.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingOption.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingOption.prototype, "onInit", null);
ShippingOption = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], ShippingOption);
exports.default = ShippingOption;
