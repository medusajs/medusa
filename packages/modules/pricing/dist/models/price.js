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
const price_list_1 = __importDefault(require("./price-list"));
const price_rule_1 = __importDefault(require("./price-rule"));
const price_set_1 = __importDefault(require("./price-set"));
const tableName = "price";
const PriceDeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
const PricePriceSetIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "price_set_id",
    where: "deleted_at IS NULL",
});
const PricePriceListIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "price_list_id",
    where: "deleted_at IS NULL",
});
const PriceCurrencyCodeIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "currency_code",
    where: "deleted_at IS NULL",
});
let Price = class Price {
    constructor() {
        this.title = null;
        this.min_quantity = null;
        this.max_quantity = null;
        this.rules_count = 0;
        this.price_rules = new core_1.Collection(this);
        this.price_list_id = null;
        this.price_list = null;
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "price");
        this.price_set_id ?? (this.price_set_id = this.price_set?.id);
        this.price_list_id ?? (this.price_list_id = this.price_list?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "price");
        this.price_set_id ?? (this.price_set_id = this.price_set?.id);
        this.price_list_id ?? (this.price_list_id = this.price_list?.id);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Price.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Price.prototype, "title", void 0);
__decorate([
    PriceCurrencyCodeIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Price.prototype, "currency_code", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], Price.prototype, "amount", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], Price.prototype, "raw_amount", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "numeric", nullable: true }),
    __metadata("design:type", Object)
], Price.prototype, "min_quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "numeric", nullable: true }),
    __metadata("design:type", Object)
], Price.prototype, "max_quantity", void 0);
__decorate([
    PricePriceSetIdIndex.MikroORMIndex(),
    (0, core_1.ManyToOne)(() => price_set_1.default, {
        columnType: "text",
        mapToPk: true,
        fieldName: "price_set_id",
        onDelete: "cascade",
    }),
    __metadata("design:type", String)
], Price.prototype, "price_set_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => price_set_1.default, { persist: false }),
    __metadata("design:type", price_set_1.default)
], Price.prototype, "price_set", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "integer", default: 0 }),
    __metadata("design:type", Number)
], Price.prototype, "rules_count", void 0);
__decorate([
    (0, core_1.OneToMany)({
        entity: () => price_rule_1.default,
        mappedBy: (pr) => pr.price,
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
    }),
    __metadata("design:type", Object)
], Price.prototype, "price_rules", void 0);
__decorate([
    PricePriceListIdIndex.MikroORMIndex(),
    (0, core_1.ManyToOne)(() => price_list_1.default, {
        columnType: "text",
        mapToPk: true,
        nullable: true,
        fieldName: "price_list_id",
        onDelete: "cascade",
    }),
    __metadata("design:type", Object)
], Price.prototype, "price_list_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => price_list_1.default, { persist: false, nullable: true }),
    __metadata("design:type", Object)
], Price.prototype, "price_list", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Price.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Price.prototype, "updated_at", void 0);
__decorate([
    PriceDeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], Price.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Price.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Price.prototype, "onInit", null);
Price = __decorate([
    (0, core_1.Entity)({ tableName }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], Price);
exports.default = Price;
