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
var ProductCategory_1;
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const product_1 = __importDefault(require("./product"));
const categoryHandleIndexName = "IDX_category_handle_unique";
const categoryHandleIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: categoryHandleIndexName,
    tableName: "product_category",
    columns: ["handle"],
    unique: true,
    where: "deleted_at IS NULL",
});
const categoryMpathIndexName = "IDX_product_category_path";
const categoryMpathIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: categoryMpathIndexName,
    tableName: "product_category",
    columns: ["mpath"],
    unique: false,
    where: "deleted_at IS NULL",
});
categoryMpathIndexStatement.MikroORMIndex();
categoryHandleIndexStatement.MikroORMIndex();
let ProductCategory = ProductCategory_1 = class ProductCategory {
    constructor() {
        this.category_children = new core_1.Collection(this);
        this.products = new core_1.Collection(this);
    }
    async onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "pcat");
        this.parent_category_id ?? (this.parent_category_id = this.parent_category?.id ?? null);
    }
    async onCreate(args) {
        this.id = (0, utils_1.generateEntityId)(this.id, "pcat");
        this.parent_category_id ?? (this.parent_category_id = this.parent_category?.id ?? null);
        if (!this.handle && this.name) {
            this.handle = (0, utils_1.kebabCase)(this.name);
        }
        const { em } = args;
        let parentCategory = null;
        if (this.parent_category_id) {
            parentCategory = await em.findOne(ProductCategory_1, this.parent_category_id);
        }
        if (parentCategory) {
            this.mpath = `${parentCategory?.mpath}${this.id}.`;
        }
        else {
            this.mpath = `${this.id}.`;
        }
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], ProductCategory.prototype, "id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: false }),
    __metadata("design:type", String)
], ProductCategory.prototype, "name", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", default: "", nullable: false }),
    __metadata("design:type", String)
], ProductCategory.prototype, "description", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: false }),
    __metadata("design:type", String)
], ProductCategory.prototype, "handle", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: false }),
    __metadata("design:type", String)
], ProductCategory.prototype, "mpath", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean", default: false }),
    __metadata("design:type", Boolean)
], ProductCategory.prototype, "is_active", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean", default: false }),
    __metadata("design:type", Boolean)
], ProductCategory.prototype, "is_internal", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "numeric", nullable: false, default: 0 }),
    __metadata("design:type", Number)
], ProductCategory.prototype, "rank", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => ProductCategory, {
        columnType: "text",
        fieldName: "parent_category_id",
        nullable: true,
        mapToPk: true,
        onDelete: "cascade",
    }),
    __metadata("design:type", Object)
], ProductCategory.prototype, "parent_category_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => ProductCategory, { nullable: true, persist: false }),
    __metadata("design:type", ProductCategory)
], ProductCategory.prototype, "parent_category", void 0);
__decorate([
    (0, core_1.OneToMany)({
        entity: () => ProductCategory,
        mappedBy: (productCategory) => productCategory.parent_category,
    }),
    __metadata("design:type", Object)
], ProductCategory.prototype, "category_children", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ProductCategory.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ProductCategory.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_product_category_deleted_at" }),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], ProductCategory.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => product_1.default, (product) => product.categories),
    __metadata("design:type", Object)
], ProductCategory.prototype, "products", void 0);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductCategory.prototype, "onInit", null);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductCategory.prototype, "onCreate", null);
ProductCategory = ProductCategory_1 = __decorate([
    (0, core_1.Entity)({ tableName: "product_category" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], ProductCategory);
exports.default = ProductCategory;
