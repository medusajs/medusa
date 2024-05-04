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
const address_1 = __importDefault(require("./address"));
const fulfillment_item_1 = __importDefault(require("./fulfillment-item"));
const fulfillment_label_1 = __importDefault(require("./fulfillment-label"));
const fulfillment_provider_1 = __importDefault(require("./fulfillment-provider"));
const shipping_option_1 = __importDefault(require("./shipping-option"));
const FulfillmentDeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "fulfillment",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
const FulfillmentProviderIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "fulfillment",
    columns: "provider_id",
    where: "deleted_at IS NULL",
});
const FulfillmentLocationIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "fulfillment",
    columns: "location_id",
    where: "deleted_at IS NULL",
});
const FulfillmentShippingOptionIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "fulfillment",
    columns: "shipping_option_id",
    where: "deleted_at IS NULL",
});
let Fulfillment = class Fulfillment {
    constructor() {
        this.packed_at = null;
        this.shipped_at = null;
        this.delivered_at = null;
        this.canceled_at = null;
        this.data = null;
        this.shipping_option_id = null;
        this.metadata = null;
        this.items = new core_1.Collection(this);
        this.labels = new core_1.Collection(this);
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ful");
        this.provider_id ?? (this.provider_id = this.provider_id ?? this.provider?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ful");
        this.provider_id ?? (this.provider_id = this.provider_id ?? this.provider?.id);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Fulfillment.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    FulfillmentLocationIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], Fulfillment.prototype, "location_id", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Fulfillment.prototype, "packed_at", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Fulfillment.prototype, "shipped_at", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Fulfillment.prototype, "delivered_at", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Fulfillment.prototype, "canceled_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Fulfillment.prototype, "data", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => fulfillment_provider_1.default, {
        columnType: "text",
        fieldName: "provider_id",
        mapToPk: true,
        nullable: true,
        onDelete: "set null",
    }),
    FulfillmentProviderIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], Fulfillment.prototype, "provider_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => shipping_option_1.default, {
        columnType: "text",
        fieldName: "shipping_option_id",
        nullable: true,
        mapToPk: true,
        onDelete: "set null",
    }),
    FulfillmentShippingOptionIdIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], Fulfillment.prototype, "shipping_option_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Fulfillment.prototype, "metadata", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => shipping_option_1.default, { persist: false }),
    __metadata("design:type", Object)
], Fulfillment.prototype, "shipping_option", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => fulfillment_provider_1.default, { persist: false }),
    __metadata("design:type", fulfillment_provider_1.default)
], Fulfillment.prototype, "provider", void 0);
__decorate([
    (0, core_1.OneToOne)({
        entity: () => address_1.default,
        owner: true,
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
        nullable: true,
        onDelete: "cascade",
    }),
    __metadata("design:type", address_1.default)
], Fulfillment.prototype, "delivery_address", void 0);
__decorate([
    (0, core_1.OneToMany)(() => fulfillment_item_1.default, (item) => item.fulfillment, {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
        orphanRemoval: true,
    }),
    __metadata("design:type", Object)
], Fulfillment.prototype, "items", void 0);
__decorate([
    (0, core_1.OneToMany)(() => fulfillment_label_1.default, (label) => label.fulfillment, {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
        orphanRemoval: true,
    }),
    __metadata("design:type", Object)
], Fulfillment.prototype, "labels", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Fulfillment.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Fulfillment.prototype, "updated_at", void 0);
__decorate([
    FulfillmentDeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], Fulfillment.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Fulfillment.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Fulfillment.prototype, "onInit", null);
Fulfillment = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], Fulfillment);
exports.default = Fulfillment;
