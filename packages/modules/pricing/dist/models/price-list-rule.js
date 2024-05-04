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
const price_list_rule_value_1 = __importDefault(require("./price-list-rule-value"));
const rule_type_1 = __importDefault(require("./rule-type"));
const tableName = "price_list_rule";
const PriceListRuleDeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
const PriceListRuleRuleTypeIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "rule_type_id",
    where: "deleted_at IS NULL",
    unique: true,
});
const PriceListRulePriceListIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "price_list_id",
    where: "deleted_at IS NULL",
});
let PriceListRule = class PriceListRule {
    constructor() {
        this.price_list_rule_values = new core_1.Collection(this);
        this.deleted_at = null;
    }
    beforeCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "plrule");
        this.price_list_id ?? (this.price_list_id = this.price_list?.id);
        this.rule_type_id ?? (this.rule_type_id = this.rule_type?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "plrule");
        this.price_list_id ?? (this.price_list_id = this.price_list?.id);
        this.rule_type_id ?? (this.rule_type_id = this.rule_type?.id);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], PriceListRule.prototype, "id", void 0);
__decorate([
    PriceListRuleRuleTypeIdIndex.MikroORMIndex(),
    (0, core_1.ManyToOne)(() => rule_type_1.default, {
        columnType: "text",
        mapToPk: true,
        fieldName: "rule_type_id",
    }),
    __metadata("design:type", String)
], PriceListRule.prototype, "rule_type_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => rule_type_1.default, { persist: false }),
    __metadata("design:type", rule_type_1.default)
], PriceListRule.prototype, "rule_type", void 0);
__decorate([
    (0, core_1.OneToMany)(() => price_list_rule_value_1.default, (plrv) => plrv.price_list_rule, {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
    }),
    __metadata("design:type", Object)
], PriceListRule.prototype, "price_list_rule_values", void 0);
__decorate([
    PriceListRulePriceListIdIndex.MikroORMIndex(),
    (0, core_1.ManyToOne)(() => price_list_1.default, {
        columnType: "text",
        mapToPk: true,
        fieldName: "price_list_id",
        onDelete: "cascade",
    }),
    __metadata("design:type", String)
], PriceListRule.prototype, "price_list_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => price_list_1.default, { persist: false }),
    __metadata("design:type", price_list_1.default)
], PriceListRule.prototype, "price_list", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PriceListRule.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PriceListRule.prototype, "updated_at", void 0);
__decorate([
    PriceListRuleDeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], PriceListRule.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PriceListRule.prototype, "beforeCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PriceListRule.prototype, "onInit", null);
PriceListRule = __decorate([
    (0, core_1.Entity)({ tableName }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], PriceListRule);
exports.default = PriceListRule;
