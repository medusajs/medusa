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
const order_1 = __importDefault(require("./order"));
const shipping_method_1 = __importDefault(require("./shipping-method"));
const OrderIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_shipping",
    columns: ["order_id"],
    where: "deleted_at IS NOT NULL",
});
const OrderVersionIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_shipping",
    columns: ["version"],
    where: "deleted_at IS NOT NULL",
});
const ItemIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_shipping",
    columns: ["shipping_method_id"],
    where: "deleted_at IS NOT NULL",
});
const DeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
let OrderShippingMethod = class OrderShippingMethod {
    constructor() {
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordspmv");
        this.order_id ?? (this.order_id = this.order?.id);
        this.shipping_method_id ?? (this.shipping_method_id = this.shipping_method?.id);
        this.version ?? (this.version = this.order?.version);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordspmv");
        this.order_id ?? (this.order_id = this.order?.id);
        this.shipping_method_id ?? (this.shipping_method_id = this.shipping_method?.id);
        this.version ?? (this.version = this.order?.version);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], OrderShippingMethod.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => order_1.default,
        mapToPk: true,
        fieldName: "order_id",
        columnType: "text",
    }),
    OrderIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], OrderShippingMethod.prototype, "order_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "integer" }),
    OrderVersionIndex.MikroORMIndex(),
    __metadata("design:type", Number)
], OrderShippingMethod.prototype, "version", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => order_1.default, {
        persist: false,
    }),
    __metadata("design:type", order_1.default)
], OrderShippingMethod.prototype, "order", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => shipping_method_1.default,
        fieldName: "shipping_method_id",
        mapToPk: true,
        columnType: "text",
    }),
    ItemIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], OrderShippingMethod.prototype, "shipping_method_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => shipping_method_1.default, {
        persist: false,
    }),
    __metadata("design:type", shipping_method_1.default)
], OrderShippingMethod.prototype, "shipping_method", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], OrderShippingMethod.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], OrderShippingMethod.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    DeletedAtIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], OrderShippingMethod.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderShippingMethod.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderShippingMethod.prototype, "onInit", null);
OrderShippingMethod = __decorate([
    (0, core_1.Entity)({ tableName: "order_shipping" })
], OrderShippingMethod);
exports.default = OrderShippingMethod;
//# sourceMappingURL=order-shipping-method.js.map