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
const FulfillmentIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "fulfillment_item",
    columns: "fulfillment_id",
    where: "deleted_at IS NULL",
});
const LineItemIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "fulfillment_item",
    columns: "line_item_id",
    where: "deleted_at IS NULL",
});
const InventoryItemIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "fulfillment_item",
    columns: "inventory_item_id",
    where: "deleted_at IS NULL",
});
const FulfillmentItemDeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "fulfillment_item",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
let FulfillmentItem = class FulfillmentItem {
    constructor() {
        this.line_item_id = null;
        this.inventory_item_id = null;
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "fulit");
        this.fulfillment_id ?? (this.fulfillment_id = this.fulfillment.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "fulit");
        this.fulfillment_id ?? (this.fulfillment_id = this.fulfillment.id);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], FulfillmentItem.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], FulfillmentItem.prototype, "title", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], FulfillmentItem.prototype, "sku", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], FulfillmentItem.prototype, "barcode", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], FulfillmentItem.prototype, "quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], FulfillmentItem.prototype, "raw_quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    LineItemIdIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], FulfillmentItem.prototype, "line_item_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    InventoryItemIdIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], FulfillmentItem.prototype, "inventory_item_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => fulfillment_1.default, {
        columnType: "text",
        mapToPk: true,
        fieldName: "fulfillment_id",
        onDelete: "cascade",
    }),
    FulfillmentIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], FulfillmentItem.prototype, "fulfillment_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => fulfillment_1.default, { persist: false }),
    __metadata("design:type", fulfillment_1.default)
], FulfillmentItem.prototype, "fulfillment", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], FulfillmentItem.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], FulfillmentItem.prototype, "updated_at", void 0);
__decorate([
    FulfillmentItemDeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], FulfillmentItem.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FulfillmentItem.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FulfillmentItem.prototype, "onInit", null);
FulfillmentItem = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], FulfillmentItem);
exports.default = FulfillmentItem;
