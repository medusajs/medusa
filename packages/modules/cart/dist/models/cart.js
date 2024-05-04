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
const line_item_1 = __importDefault(require("./line-item"));
const shipping_method_1 = __importDefault(require("./shipping-method"));
const RegionIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    name: "IDX_cart_region_id",
    tableName: "cart",
    columns: "region_id",
    where: "deleted_at IS NULL AND region_id IS NOT NULL",
}).MikroORMIndex;
const CustomerIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    name: "IDX_cart_customer_id",
    tableName: "cart",
    columns: "customer_id",
    where: "deleted_at IS NULL AND customer_id IS NOT NULL",
}).MikroORMIndex;
const SalesChannelIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    name: "IDX_cart_sales_channel_id",
    tableName: "cart",
    columns: "sales_channel_id",
    where: "deleted_at IS NULL AND sales_channel_id IS NOT NULL",
}).MikroORMIndex;
const CurrencyCodeIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    name: "IDX_cart_curency_code",
    tableName: "cart",
    columns: "currency_code",
    where: "deleted_at IS NULL",
}).MikroORMIndex;
const ShippingAddressIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    name: "IDX_cart_shipping_address_id",
    tableName: "cart",
    columns: "shipping_address_id",
    where: "deleted_at IS NULL AND shipping_address_id IS NOT NULL",
}).MikroORMIndex;
const BillingAddressIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    name: "IDX_cart_billing_address_id",
    tableName: "cart",
    columns: "billing_address_id",
    where: "deleted_at IS NULL AND billing_address_id IS NOT NULL",
}).MikroORMIndex;
const DeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "cart",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
}).MikroORMIndex;
let Cart = class Cart {
    constructor() {
        this.region_id = null;
        this.customer_id = null;
        this.sales_channel_id = null;
        this.email = null;
        this.metadata = null;
        this.items = new core_1.Collection(this);
        this.shipping_methods = new core_1.Collection(this);
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "cart");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "cart");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Cart.prototype, "id", void 0);
__decorate([
    RegionIdIndex(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Cart.prototype, "region_id", void 0);
__decorate([
    CustomerIdIndex(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Cart.prototype, "customer_id", void 0);
__decorate([
    SalesChannelIdIndex(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Cart.prototype, "sales_channel_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Cart.prototype, "email", void 0);
__decorate([
    CurrencyCodeIndex(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Cart.prototype, "currency_code", void 0);
__decorate([
    ShippingAddressIdIndex(),
    (0, core_1.ManyToOne)({
        entity: () => address_1.default,
        columnType: "text",
        fieldName: "shipping_address_id",
        mapToPk: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Cart.prototype, "shipping_address_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => address_1.default, {
        cascade: [core_1.Cascade.PERSIST],
        nullable: true,
    }),
    __metadata("design:type", Object)
], Cart.prototype, "shipping_address", void 0);
__decorate([
    BillingAddressIdIndex(),
    (0, core_1.ManyToOne)({
        entity: () => address_1.default,
        columnType: "text",
        fieldName: "billing_address_id",
        mapToPk: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Cart.prototype, "billing_address_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => address_1.default, {
        cascade: [core_1.Cascade.PERSIST],
        nullable: true,
    }),
    __metadata("design:type", Object)
], Cart.prototype, "billing_address", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Cart.prototype, "metadata", void 0);
__decorate([
    (0, core_1.OneToMany)(() => line_item_1.default, (lineItem) => lineItem.cart, {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
    }),
    __metadata("design:type", Object)
], Cart.prototype, "items", void 0);
__decorate([
    (0, core_1.OneToMany)(() => shipping_method_1.default, (shippingMethod) => shippingMethod.cart, {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
    }),
    __metadata("design:type", Object)
], Cart.prototype, "shipping_methods", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Cart.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Cart.prototype, "updated_at", void 0);
__decorate([
    DeletedAtIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], Cart.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Cart.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Cart.prototype, "onInit", null);
Cart = __decorate([
    (0, core_1.Entity)({ tableName: "cart" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], Cart);
exports.default = Cart;
