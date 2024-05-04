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
exports.PriceListIdPrefix = void 0;
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const price_1 = __importDefault(require("./price"));
const price_list_rule_1 = __importDefault(require("./price-list-rule"));
const rule_type_1 = __importDefault(require("./rule-type"));
const tableName = "price_list";
const PriceListDeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
exports.PriceListIdPrefix = "plist";
let PriceList = class PriceList {
    constructor() {
        this.starts_at = null;
        this.ends_at = null;
        this.prices = new core_1.Collection(this);
        this.price_list_rules = new core_1.Collection(this);
        this.rule_types = new core_1.Collection(this);
        this.rules_count = 0;
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, exports.PriceListIdPrefix);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, exports.PriceListIdPrefix);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], PriceList.prototype, "id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], PriceList.prototype, "title", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], PriceList.prototype, "description", void 0);
__decorate([
    (0, core_1.Enum)({ items: () => utils_1.PriceListStatus, default: utils_1.PriceListStatus.DRAFT }),
    __metadata("design:type", String)
], PriceList.prototype, "status", void 0);
__decorate([
    (0, core_1.Enum)({ items: () => utils_1.PriceListType, default: utils_1.PriceListType.SALE }),
    __metadata("design:type", String)
], PriceList.prototype, "type", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], PriceList.prototype, "starts_at", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], PriceList.prototype, "ends_at", void 0);
__decorate([
    (0, core_1.OneToMany)(() => price_1.default, (price) => price.price_list, {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
    }),
    __metadata("design:type", Object)
], PriceList.prototype, "prices", void 0);
__decorate([
    (0, core_1.OneToMany)(() => price_list_rule_1.default, (pr) => pr.price_list, {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
    }),
    __metadata("design:type", Object)
], PriceList.prototype, "price_list_rules", void 0);
__decorate([
    (0, core_1.ManyToMany)({
        entity: () => rule_type_1.default,
        pivotEntity: () => price_list_rule_1.default,
    }),
    __metadata("design:type", Object)
], PriceList.prototype, "rule_types", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "integer", default: 0 }),
    __metadata("design:type", Number)
], PriceList.prototype, "rules_count", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PriceList.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PriceList.prototype, "updated_at", void 0);
__decorate([
    PriceListDeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], PriceList.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PriceList.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PriceList.prototype, "onInit", null);
PriceList = __decorate([
    (0, core_1.Entity)({ tableName }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], PriceList);
exports.default = PriceList;
