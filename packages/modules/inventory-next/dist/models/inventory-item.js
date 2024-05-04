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
exports.InventoryItem = void 0;
const core_1 = require("@mikro-orm/core");
const utils_1 = require("@medusajs/utils");
const inventory_level_1 = require("./inventory-level");
const reservation_item_1 = require("./reservation-item");
const InventoryItemDeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "inventory_item",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
const InventoryItemSkuIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "inventory_item",
    columns: "sku",
    unique: true,
});
let InventoryItem = class InventoryItem {
    constructor() {
        this.deleted_at = null;
        this.sku = null;
        this.origin_country = null;
        this.hs_code = null;
        this.mid_code = null;
        this.material = null;
        this.weight = null;
        this.length = null;
        this.height = null;
        this.width = null;
        this.requires_shipping = true;
        this.description = null;
        this.title = null;
        this.thumbnail = null;
        this.metadata = null;
        this.location_levels = new core_1.Collection(this);
        this.reservation_items = new core_1.Collection(this);
    }
    beforeCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "iitem");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "iitem");
    }
};
exports.InventoryItem = InventoryItem;
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], InventoryItem.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], InventoryItem.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], InventoryItem.prototype, "updated_at", void 0);
__decorate([
    InventoryItemDeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "deleted_at", void 0);
__decorate([
    InventoryItemSkuIndex.MikroORMIndex(),
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "sku", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "origin_country", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "hs_code", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "mid_code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "material", void 0);
__decorate([
    (0, core_1.Property)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "weight", void 0);
__decorate([
    (0, core_1.Property)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "length", void 0);
__decorate([
    (0, core_1.Property)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "height", void 0);
__decorate([
    (0, core_1.Property)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "width", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean" }),
    __metadata("design:type", Boolean)
], InventoryItem.prototype, "requires_shipping", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "description", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "title", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "thumbnail", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "metadata", void 0);
__decorate([
    (0, core_1.OneToMany)(() => inventory_level_1.InventoryLevel, (inventoryLevel) => inventoryLevel.inventory_item, {
        cascade: ["soft-remove"],
    }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "location_levels", void 0);
__decorate([
    (0, core_1.OneToMany)(() => reservation_item_1.ReservationItem, (reservationItem) => reservationItem.inventory_item, {
        cascade: ["soft-remove"],
    }),
    __metadata("design:type", Object)
], InventoryItem.prototype, "reservation_items", void 0);
__decorate([
    (0, core_1.Formula)((item) => `(SELECT SUM(reserved_quantity) FROM inventory_level il WHERE il.inventory_item_id = ${item}.id)`, { lazy: true, serializer: Number, hidden: true }),
    __metadata("design:type", Number)
], InventoryItem.prototype, "reserved_quantity", void 0);
__decorate([
    (0, core_1.Formula)((item) => `(SELECT SUM(stocked_quantity) FROM inventory_level il WHERE il.inventory_item_id = ${item}.id)`, { lazy: true, serializer: Number, hidden: true }),
    __metadata("design:type", Number)
], InventoryItem.prototype, "stocked_quantity", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryItem.prototype, "beforeCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryItem.prototype, "onInit", null);
exports.InventoryItem = InventoryItem = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], InventoryItem);
