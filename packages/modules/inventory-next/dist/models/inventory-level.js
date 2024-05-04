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
exports.InventoryLevel = void 0;
const core_1 = require("@mikro-orm/core");
const utils_1 = require("@medusajs/utils");
const inventory_item_1 = require("./inventory-item");
const utils_2 = require("@medusajs/utils");
const utils_3 = require("@medusajs/utils");
const InventoryLevelDeletedAtIndex = (0, utils_2.createPsqlIndexStatementHelper)({
    tableName: "inventory_level",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
const InventoryLevelInventoryItemIdIndex = (0, utils_2.createPsqlIndexStatementHelper)({
    tableName: "inventory_level",
    columns: "inventory_item_id",
});
const InventoryLevelLocationIdIndex = (0, utils_2.createPsqlIndexStatementHelper)({
    tableName: "inventory_level",
    columns: "location_id",
});
const InventoryLevelLocationIdInventoryItemIdIndex = (0, utils_2.createPsqlIndexStatementHelper)({
    tableName: "inventory_level",
    columns: "location_id",
});
let InventoryLevel = class InventoryLevel {
    constructor() {
        this.deleted_at = null;
        this.stocked_quantity = 0;
        this.reserved_quantity = 0;
        this.incoming_quantity = 0;
        this.available_quantity = null;
    }
    beforeCreate() {
        this.id = (0, utils_3.generateEntityId)(this.id, "ilev");
        this.inventory_item_id ?? (this.inventory_item_id = this.inventory_item?.id);
    }
    onInit() {
        this.id = (0, utils_3.generateEntityId)(this.id, "ilev");
    }
    onLoad() {
        if ((0, utils_1.isDefined)(this.stocked_quantity) && (0, utils_1.isDefined)(this.reserved_quantity)) {
            this.available_quantity = this.stocked_quantity - this.reserved_quantity;
        }
    }
};
exports.InventoryLevel = InventoryLevel;
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], InventoryLevel.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], InventoryLevel.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], InventoryLevel.prototype, "updated_at", void 0);
__decorate([
    InventoryLevelDeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], InventoryLevel.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => inventory_item_1.InventoryItem, {
        fieldName: "inventory_item_id",
        type: "text",
        mapToPk: true,
        onDelete: "cascade",
    }),
    InventoryLevelInventoryItemIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], InventoryLevel.prototype, "inventory_item_id", void 0);
__decorate([
    InventoryLevelLocationIdIndex.MikroORMIndex(),
    (0, core_1.Property)({ type: "text" }),
    __metadata("design:type", String)
], InventoryLevel.prototype, "location_id", void 0);
__decorate([
    (0, core_1.Property)({ type: "int" }),
    __metadata("design:type", Number)
], InventoryLevel.prototype, "stocked_quantity", void 0);
__decorate([
    (0, core_1.Property)({ type: "int" }),
    __metadata("design:type", Number)
], InventoryLevel.prototype, "reserved_quantity", void 0);
__decorate([
    (0, core_1.Property)({ type: "int" }),
    __metadata("design:type", Number)
], InventoryLevel.prototype, "incoming_quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], InventoryLevel.prototype, "metadata", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => inventory_item_1.InventoryItem, {
        persist: false,
    }),
    __metadata("design:type", inventory_item_1.InventoryItem)
], InventoryLevel.prototype, "inventory_item", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryLevel.prototype, "beforeCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryLevel.prototype, "onInit", null);
__decorate([
    (0, core_1.OnLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryLevel.prototype, "onLoad", null);
exports.InventoryLevel = InventoryLevel = __decorate([
    (0, core_1.Entity)(),
    InventoryLevelLocationIdInventoryItemIdIndex.MikroORMIndex(),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], InventoryLevel);
