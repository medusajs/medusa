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
const _models_1 = require(".");
const variantSkuIndexName = "IDX_product_variant_sku_unique";
const variantSkuIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: variantSkuIndexName,
    tableName: "product_variant",
    columns: ["sku"],
    unique: true,
    where: "deleted_at IS NULL",
});
const variantBarcodeIndexName = "IDX_product_variant_barcode_unique";
const variantBarcodeIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: variantBarcodeIndexName,
    tableName: "product_variant",
    columns: ["barcode"],
    unique: true,
    where: "deleted_at IS NULL",
});
const variantEanIndexName = "IDX_product_variant_ean_unique";
const variantEanIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: variantEanIndexName,
    tableName: "product_variant",
    columns: ["ean"],
    unique: true,
    where: "deleted_at IS NULL",
});
const variantUpcIndexName = "IDX_product_variant_upc_unique";
const variantUpcIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: variantUpcIndexName,
    tableName: "product_variant",
    columns: ["upc"],
    unique: true,
    where: "deleted_at IS NULL",
});
const variantProductIdIndexName = "IDX_product_variant_product_id";
const variantProductIdIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: variantProductIdIndexName,
    tableName: "product_variant",
    columns: ["product_id"],
    unique: false,
    where: "deleted_at IS NULL",
});
variantProductIdIndexStatement.MikroORMIndex();
variantSkuIndexStatement.MikroORMIndex();
variantBarcodeIndexStatement.MikroORMIndex();
variantEanIndexStatement.MikroORMIndex();
variantUpcIndexStatement.MikroORMIndex();
let ProductVariant = class ProductVariant {
    constructor() {
        // TODO: replace with BigNumber
        // Note: Upon serialization, this turns to a string. This is on purpose, because you would loose
        // precision if you cast numeric to JS number, as JS number is a float.
        // Ref: https://github.com/mikro-orm/mikro-orm/issues/2295
        this.inventory_quantity = 100;
        this.allow_backorder = false;
        this.manage_inventory = true;
        this.options = new core_1.Collection(this);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "variant");
        this.product_id ?? (this.product_id = this.product?.id ?? null);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], ProductVariant.prototype, "id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], ProductVariant.prototype, "title", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "sku", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "barcode", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "ean", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "upc", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "numeric",
        default: 100,
        serializer: utils_1.optionalNumericSerializer,
    }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "inventory_quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean", default: false }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "allow_backorder", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean", default: true }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "manage_inventory", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "hs_code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "origin_country", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "mid_code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "material", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "numeric", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "weight", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "numeric", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "length", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "numeric", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "height", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "numeric", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "width", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "numeric",
        nullable: true,
        default: 0,
        serializer: utils_1.optionalNumericSerializer,
    }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "variant_rank", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => _models_1.Product, {
        columnType: "text",
        nullable: true,
        onDelete: "cascade",
        fieldName: "product_id",
        mapToPk: true,
    }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "product_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => _models_1.Product, {
        persist: false,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "product", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => _models_1.ProductOptionValue, "variants", {
        owner: true,
        pivotTable: "product_variant_option",
        joinColumn: "variant_id",
        inverseJoinColumn: "option_value_id",
    }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "options", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ProductVariant.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ProductVariant.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_product_variant_deleted_at" }),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], ProductVariant.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.OnInit)(),
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductVariant.prototype, "onInit", null);
ProductVariant = __decorate([
    (0, core_1.Entity)({ tableName: "product_variant" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], ProductVariant);
exports.default = ProductVariant;
