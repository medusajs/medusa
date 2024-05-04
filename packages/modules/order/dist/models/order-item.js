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
const line_item_1 = __importDefault(require("./line-item"));
const order_1 = __importDefault(require("./order"));
const OrderIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_item",
    columns: ["order_id"],
    where: "deleted_at IS NOT NULL",
});
const OrderVersionIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_item",
    columns: ["version"],
    where: "deleted_at IS NOT NULL",
});
const ItemIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_item",
    columns: ["item_id"],
    where: "deleted_at IS NOT NULL",
});
const DeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
let OrderItem = class OrderItem {
    constructor() {
        this.fulfilled_quantity = 0;
        this.shipped_quantity = 0;
        this.return_requested_quantity = 0;
        this.return_received_quantity = 0;
        this.return_dismissed_quantity = 0;
        this.written_off_quantity = 0;
        this.metadata = null;
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "orditem");
        this.order_id ?? (this.order_id = this.order?.id);
        this.item_id ?? (this.item_id = this.item?.id);
        this.version ?? (this.version = this.order?.version);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "orditem");
        this.order_id ?? (this.order_id = this.order?.id);
        this.item_id ?? (this.item_id = this.item?.id);
        this.version ?? (this.version = this.order?.version);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], OrderItem.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => order_1.default,
        mapToPk: true,
        fieldName: "order_id",
        columnType: "text",
    }),
    OrderIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], OrderItem.prototype, "order_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "integer" }),
    OrderVersionIndex.MikroORMIndex(),
    __metadata("design:type", Number)
], OrderItem.prototype, "version", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => order_1.default, {
        persist: false,
    }),
    __metadata("design:type", order_1.default)
], OrderItem.prototype, "order", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => line_item_1.default,
        fieldName: "item_id",
        mapToPk: true,
        columnType: "text",
    }),
    ItemIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], OrderItem.prototype, "item_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => line_item_1.default, {
        persist: false,
    }),
    __metadata("design:type", line_item_1.default)
], OrderItem.prototype, "item", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], OrderItem.prototype, "raw_quantity", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], OrderItem.prototype, "fulfilled_quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], OrderItem.prototype, "raw_fulfilled_quantity", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], OrderItem.prototype, "shipped_quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], OrderItem.prototype, "raw_shipped_quantity", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], OrderItem.prototype, "return_requested_quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], OrderItem.prototype, "raw_return_requested_quantity", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], OrderItem.prototype, "return_received_quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], OrderItem.prototype, "raw_return_received_quantity", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], OrderItem.prototype, "return_dismissed_quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], OrderItem.prototype, "raw_return_dismissed_quantity", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], OrderItem.prototype, "written_off_quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], OrderItem.prototype, "raw_written_off_quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], OrderItem.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], OrderItem.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], OrderItem.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    DeletedAtIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], OrderItem.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderItem.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderItem.prototype, "onInit", null);
OrderItem = __decorate([
    (0, core_1.Entity)({ tableName: "order_item" })
], OrderItem);
exports.default = OrderItem;
//# sourceMappingURL=order-item.js.map