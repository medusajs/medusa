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
exports.StockLocationAddress = void 0;
const core_1 = require("@mikro-orm/core");
const utils_1 = require("@medusajs/utils");
const StockLocationAddressDeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "stock_location_address",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
let StockLocationAddress = class StockLocationAddress {
    constructor() {
        this.deleted_at = null;
    }
    beforeCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "laddr");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "laddr");
    }
};
exports.StockLocationAddress = StockLocationAddress;
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], StockLocationAddress.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], StockLocationAddress.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], StockLocationAddress.prototype, "updated_at", void 0);
__decorate([
    StockLocationAddressDeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], StockLocationAddress.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], StockLocationAddress.prototype, "address_1", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], StockLocationAddress.prototype, "address_2", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], StockLocationAddress.prototype, "company", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], StockLocationAddress.prototype, "city", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], StockLocationAddress.prototype, "country_code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], StockLocationAddress.prototype, "phone", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], StockLocationAddress.prototype, "province", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], StockLocationAddress.prototype, "postal_code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], StockLocationAddress.prototype, "metadata", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockLocationAddress.prototype, "beforeCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockLocationAddress.prototype, "onInit", null);
exports.StockLocationAddress = StockLocationAddress = __decorate([
    (0, core_1.Entity)()
], StockLocationAddress);
