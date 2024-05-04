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
const product_1 = __importDefault(require("./product"));
const collectionHandleIndexName = "IDX_collection_handle_unique";
const collectionHandleIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: collectionHandleIndexName,
    tableName: "product_collection",
    columns: ["handle"],
    unique: true,
    where: "deleted_at IS NULL",
});
collectionHandleIndexStatement.MikroORMIndex();
let ProductCollection = class ProductCollection {
    constructor() {
        this.products = new core_1.Collection(this);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "pcol");
        if (!this.handle && this.title) {
            this.handle = (0, utils_1.kebabCase)(this.title);
        }
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], ProductCollection.prototype, "id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], ProductCollection.prototype, "title", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], ProductCollection.prototype, "handle", void 0);
__decorate([
    (0, core_1.OneToMany)(() => product_1.default, (product) => product.collection),
    __metadata("design:type", Object)
], ProductCollection.prototype, "products", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], ProductCollection.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ProductCollection.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ProductCollection.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_product_collection_deleted_at" }),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], ProductCollection.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.OnInit)(),
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductCollection.prototype, "onInit", null);
ProductCollection = __decorate([
    (0, core_1.Entity)({ tableName: "product_collection" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], ProductCollection);
exports.default = ProductCollection;
