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
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const StoreDeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "store",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
let Store = class Store {
    constructor() {
        this.supported_currency_codes = [];
        this.default_currency_code = null;
        this.default_sales_channel_id = null;
        this.default_region_id = null;
        this.default_location_id = null;
        this.metadata = null;
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "store");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "store");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Store.prototype, "id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", default: "Medusa Store" }),
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ type: "array", default: "{}" }),
    __metadata("design:type", Array)
], Store.prototype, "supported_currency_codes", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "default_currency_code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "default_sales_channel_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "default_region_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "default_location_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Store.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Store.prototype, "updated_at", void 0);
__decorate([
    StoreDeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Store.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Store.prototype, "onInit", null);
Store = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], Store);
exports.default = Store;
