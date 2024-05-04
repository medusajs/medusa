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
const order_item_1 = __importDefault(require("./order-item"));
const order_shipping_method_1 = __importDefault(require("./order-shipping-method"));
const order_summary_1 = __importDefault(require("./order-summary"));
const transaction_1 = __importDefault(require("./transaction"));
const RegionIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order",
    columns: "region_id",
    where: "deleted_at IS NOT NULL",
});
const CustomerIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order",
    columns: "customer_id",
    where: "deleted_at IS NOT NULL",
});
const SalesChannelIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order",
    columns: "customer_id",
    where: "deleted_at IS NOT NULL",
});
const OrderDeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
const CurrencyCodeIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order",
    columns: "currency_code",
    where: "deleted_at IS NOT NULL",
});
const ShippingAddressIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order",
    columns: "shipping_address_id",
    where: "deleted_at IS NOT NULL",
});
const BillingAddressIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order",
    columns: "billing_address_id",
    where: "deleted_at IS NOT NULL",
});
const IsDraftOrderIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order",
    columns: "is_draft_order",
    where: "deleted_at IS NOT NULL",
});
let Order = class Order {
    constructor() {
        this.region_id = null;
        this.customer_id = null;
        this.version = 1;
        this.sales_channel_id = null;
        this.is_draft_order = false;
        this.email = null;
        this.no_notification = null;
        this.summary = new core_1.Collection(this);
        this.metadata = null;
        this.items = new core_1.Collection(this);
        this.shipping_methods = new core_1.Collection(this);
        this.transactions = new core_1.Collection(this);
        this.deleted_at = null;
        this.canceled_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "order");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "order");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "text",
        nullable: true,
    }),
    RegionIdIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], Order.prototype, "region_id", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "text",
        nullable: true,
    }),
    CustomerIdIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], Order.prototype, "customer_id", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "integer",
        defaultRaw: "1",
    }),
    __metadata("design:type", Number)
], Order.prototype, "version", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "text",
        nullable: true,
    }),
    SalesChannelIdIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], Order.prototype, "sales_channel_id", void 0);
__decorate([
    (0, core_1.Enum)({ items: () => utils_1.OrderStatus, default: utils_1.OrderStatus.PENDING }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "boolean",
    }),
    IsDraftOrderIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], Order.prototype, "is_draft_order", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "email", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    CurrencyCodeIndex.MikroORMIndex(),
    __metadata("design:type", String)
], Order.prototype, "currency_code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    ShippingAddressIdIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], Order.prototype, "shipping_address_id", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => address_1.default,
        fieldName: "shipping_address_id",
        nullable: true,
        cascade: [core_1.Cascade.PERSIST],
    }),
    __metadata("design:type", Object)
], Order.prototype, "shipping_address", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    BillingAddressIdIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], Order.prototype, "billing_address_id", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => address_1.default,
        fieldName: "billing_address_id",
        nullable: true,
        cascade: [core_1.Cascade.PERSIST],
    }),
    __metadata("design:type", Object)
], Order.prototype, "billing_address", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean", nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "no_notification", void 0);
__decorate([
    (0, core_1.OneToMany)(() => order_summary_1.default, (summary) => summary.order, {
        cascade: [core_1.Cascade.PERSIST],
    }),
    __metadata("design:type", Object)
], Order.prototype, "summary", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "metadata", void 0);
__decorate([
    (0, core_1.OneToMany)(() => order_item_1.default, (itemDetail) => itemDetail.order, {
        cascade: [core_1.Cascade.PERSIST],
    }),
    __metadata("design:type", Object)
], Order.prototype, "items", void 0);
__decorate([
    (0, core_1.OneToMany)(() => order_shipping_method_1.default, (shippingMethod) => shippingMethod.order, {
        cascade: [core_1.Cascade.PERSIST],
    }),
    __metadata("design:type", Object)
], Order.prototype, "shipping_methods", void 0);
__decorate([
    (0, core_1.OneToMany)(() => transaction_1.default, (transaction) => transaction.order, {
        cascade: [core_1.Cascade.PERSIST],
    }),
    __metadata("design:type", Object)
], Order.prototype, "transactions", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Order.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Order.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    OrderDeletedAtIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], Order.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "canceled_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Order.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Order.prototype, "onInit", null);
Order = __decorate([
    (0, core_1.Entity)({ tableName: "order" })
], Order);
exports.default = Order;
//# sourceMappingURL=order.js.map