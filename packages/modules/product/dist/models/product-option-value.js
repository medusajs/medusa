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
const index_1 = require("./index");
const optionValueOptionIdIndexName = "IDX_option_value_option_id_unique";
const optionValueOptionIdIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: optionValueOptionIdIndexName,
    tableName: "product_option_value",
    columns: ["option_id", "value"],
    unique: true,
    where: "deleted_at IS NULL",
});
optionValueOptionIdIndexStatement.MikroORMIndex();
let ProductOptionValue = class ProductOptionValue {
    constructor() {
        this.variants = new core_1.Collection(this);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "optval");
        this.option_id ?? (this.option_id = this.option?.id ?? null);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], ProductOptionValue.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], ProductOptionValue.prototype, "value", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => index_1.ProductOption, {
        columnType: "text",
        fieldName: "option_id",
        mapToPk: true,
        nullable: true,
        onDelete: "cascade",
    }),
    __metadata("design:type", Object)
], ProductOptionValue.prototype, "option_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => index_1.ProductOption, {
        nullable: true,
        persist: false,
    }),
    __metadata("design:type", Object)
], ProductOptionValue.prototype, "option", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => index_1.ProductVariant, (variant) => variant.options),
    __metadata("design:type", Object)
], ProductOptionValue.prototype, "variants", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], ProductOptionValue.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ProductOptionValue.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ProductOptionValue.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_product_option_value_deleted_at" }),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], ProductOptionValue.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.OnInit)(),
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductOptionValue.prototype, "onInit", null);
ProductOptionValue = __decorate([
    (0, core_1.Entity)({ tableName: "product_option_value" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], ProductOptionValue);
exports.default = ProductOptionValue;
