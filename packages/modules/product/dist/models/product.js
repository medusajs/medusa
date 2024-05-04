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
const core_1 = require("@mikro-orm/core");
const utils_1 = require("@medusajs/utils");
const product_category_1 = __importDefault(require("./product-category"));
const product_collection_1 = __importDefault(require("./product-collection"));
const product_image_1 = __importDefault(require("./product-image"));
const product_option_1 = __importDefault(require("./product-option"));
const product_tag_1 = __importDefault(require("./product-tag"));
const product_type_1 = __importDefault(require("./product-type"));
const product_variant_1 = __importDefault(require("./product-variant"));
const productHandleIndexName = "IDX_product_handle_unique";
const productHandleIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: productHandleIndexName,
    tableName: "product",
    columns: ["handle"],
    unique: true,
    where: "deleted_at IS NULL",
});
const productTypeIndexName = "IDX_product_type_id";
const productTypeIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: productTypeIndexName,
    tableName: "product",
    columns: ["type_id"],
    unique: false,
    where: "deleted_at IS NULL",
});
const productCollectionIndexName = "IDX_product_collection_id";
const productCollectionIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: productCollectionIndexName,
    tableName: "product",
    columns: ["collection_id"],
    unique: false,
    where: "deleted_at IS NULL",
});
productTypeIndexStatement.MikroORMIndex();
productCollectionIndexStatement.MikroORMIndex();
productHandleIndexStatement.MikroORMIndex();
let Product = class Product {
    constructor() {
        this.options = new core_1.Collection(this);
        this.variants = new core_1.Collection(this);
        this.tags = new core_1.Collection(this);
        this.images = new core_1.Collection(this);
        this.categories = new core_1.Collection(this);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "prod");
        this.type_id ?? (this.type_id = this.type?.id ?? null);
        this.collection_id ?? (this.collection_id = this.collection?.id ?? null);
        if (!this.handle && this.title) {
            this.handle = (0, utils_1.kebabCase)(this.title);
        }
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Product.prototype, "title", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Product.prototype, "handle", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "subtitle", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({
        columnType: "text",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Product.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "is_giftcard", void 0);
__decorate([
    (0, core_1.Enum)(() => utils_1.ProductUtils.ProductStatus),
    (0, core_1.Property)({ default: utils_1.ProductUtils.ProductStatus.DRAFT }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "thumbnail", void 0);
__decorate([
    (0, core_1.OneToMany)(() => product_option_1.default, (o) => o.product, {
        cascade: ["soft-remove"],
    }),
    __metadata("design:type", Object)
], Product.prototype, "options", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.OneToMany)(() => product_variant_1.default, (variant) => variant.product, {
        cascade: ["soft-remove"],
    }),
    __metadata("design:type", Object)
], Product.prototype, "variants", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "weight", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "length", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "height", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "width", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "origin_country", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "hs_code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "mid_code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "material", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.ManyToOne)(() => product_collection_1.default, {
        columnType: "text",
        nullable: true,
        fieldName: "collection_id",
        mapToPk: true,
        onDelete: "set null",
    }),
    __metadata("design:type", Object)
], Product.prototype, "collection_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => product_collection_1.default, {
        nullable: true,
        persist: false,
    }),
    __metadata("design:type", Object)
], Product.prototype, "collection", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => product_type_1.default, {
        columnType: "text",
        nullable: true,
        fieldName: "type_id",
        mapToPk: true,
        onDelete: "set null",
    }),
    __metadata("design:type", Object)
], Product.prototype, "type_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => product_type_1.default, {
        nullable: true,
        persist: false,
    }),
    __metadata("design:type", Object)
], Product.prototype, "type", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => product_tag_1.default, "products", {
        owner: true,
        pivotTable: "product_tags",
        index: "IDX_product_tag_id",
    }),
    __metadata("design:type", Object)
], Product.prototype, "tags", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => product_image_1.default, "products", {
        owner: true,
        pivotTable: "product_images",
        joinColumn: "product_id",
        inverseJoinColumn: "image_id",
    }),
    __metadata("design:type", Object)
], Product.prototype, "images", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => product_category_1.default, "products", {
        owner: true,
        pivotTable: "product_category_product",
    }),
    __metadata("design:type", Object)
], Product.prototype, "categories", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean", default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "discountable", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "external_id", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Product.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Product.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_product_deleted_at" }),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], Product.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "metadata", void 0);
__decorate([
    (0, core_1.OnInit)(),
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Product.prototype, "onInit", null);
Product = __decorate([
    (0, core_1.Entity)({ tableName: "product" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], Product);
exports.default = Product;
