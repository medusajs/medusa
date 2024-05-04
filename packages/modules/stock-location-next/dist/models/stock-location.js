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
exports.StockLocation = void 0;
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const stock_location_address_1 = require("./stock-location-address");
const StockLocationDeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "stock_location",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
let StockLocation = class StockLocation {
    constructor() {
        this.deleted_at = null;
    }
    beforeCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "sloc");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "sloc");
    }
};
exports.StockLocation = StockLocation;
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], StockLocation.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], StockLocation.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], StockLocation.prototype, "updated_at", void 0);
__decorate([
    StockLocationDeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], StockLocation.prototype, "deleted_at", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], StockLocation.prototype, "name", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => stock_location_address_1.StockLocationAddress, {
        fieldName: "address_id",
        type: "text",
        mapToPk: true,
        nullable: true,
        onDelete: "cascade",
    }),
    __metadata("design:type", Object)
], StockLocation.prototype, "address_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => stock_location_address_1.StockLocationAddress, {
        nullable: true,
    }),
    __metadata("design:type", Object)
], StockLocation.prototype, "address", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], StockLocation.prototype, "metadata", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockLocation.prototype, "beforeCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockLocation.prototype, "onInit", null);
exports.StockLocation = StockLocation = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], StockLocation);
