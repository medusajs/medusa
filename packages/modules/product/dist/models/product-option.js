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
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const index_1 = require("./index");
const product_option_value_1 = __importDefault(require("./product-option-value"));
const optionProductIdTitleIndexName = "IDX_option_product_id_title_unique";
const optionProductIdTitleIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: optionProductIdTitleIndexName,
    tableName: "product_option",
    columns: ["product_id", "title"],
    unique: true,
    where: "deleted_at IS NULL",
});
optionProductIdTitleIndexStatement.MikroORMIndex();
let ProductOption = class ProductOption {
    constructor() {
        this.values = new core_1.Collection(this);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "opt");
        this.product_id ?? (this.product_id = this.product?.id ?? null);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], ProductOption.prototype, "id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], ProductOption.prototype, "title", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => index_1.Product, {
        columnType: "text",
        fieldName: "product_id",
        mapToPk: true,
        nullable: true,
        onDelete: "cascade",
    }),
    __metadata("design:type", Object)
], ProductOption.prototype, "product_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => index_1.Product, {
        persist: false,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductOption.prototype, "product", void 0);
__decorate([
    (0, core_1.OneToMany)(() => product_option_value_1.default, (value) => value.option, {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
    }),
    __metadata("design:type", Object)
], ProductOption.prototype, "values", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], ProductOption.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ProductOption.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ProductOption.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_product_option_deleted_at" }),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], ProductOption.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.OnInit)(),
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductOption.prototype, "onInit", null);
ProductOption = __decorate([
    (0, core_1.Entity)({ tableName: "product_option" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], ProductOption);
exports.default = ProductOption;
