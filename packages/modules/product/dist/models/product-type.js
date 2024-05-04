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
const core_1 = require("@mikro-orm/core");
const utils_1 = require("@medusajs/utils");
const typeValueIndexName = "IDX_type_value_unique";
const typeValueIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: typeValueIndexName,
    tableName: "product_type",
    columns: ["value"],
    unique: true,
    where: "deleted_at IS NULL",
});
typeValueIndexStatement.MikroORMIndex();
let ProductType = class ProductType {
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ptyp");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], ProductType.prototype, "id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], ProductType.prototype, "value", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "json", nullable: true }),
    __metadata("design:type", Object)
], ProductType.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ProductType.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ProductType.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_product_type_deleted_at" }),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], ProductType.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.OnInit)(),
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductType.prototype, "onInit", null);
ProductType = __decorate([
    (0, core_1.Entity)({ tableName: "product_type" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], ProductType);
exports.default = ProductType;
