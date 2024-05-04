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
const price_1 = __importDefault(require("./price"));
const price_set_1 = __importDefault(require("./price-set"));
const rule_type_1 = __importDefault(require("./rule-type"));
const tableName = "price_rule";
const PriceRuleDeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
const PriceRulePriceSetIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "price_set_id",
    where: "deleted_at IS NULL",
});
const PriceRuleRuleTypeIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "rule_type_id",
    where: "deleted_at IS NULL",
});
const PriceRulePriceIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: ["price_id", "rule_type_id"],
    where: "deleted_at IS NULL",
    unique: true,
});
let PriceRule = class PriceRule {
    constructor() {
        this.priority = 0;
        this.deleted_at = null;
    }
    beforeCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "prule");
        this.rule_type_id ?? (this.rule_type_id = this.rule_type?.id);
        this.price_set_id ?? (this.price_set_id = this.price_set?.id);
        this.price_id ?? (this.price_id = this.price?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "prule");
        this.rule_type_id ?? (this.rule_type_id = this.rule_type?.id);
        this.price_set_id ?? (this.price_set_id = this.price_set?.id);
        this.price_id ?? (this.price_id = this.price?.id);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], PriceRule.prototype, "id", void 0);
__decorate([
    PriceRulePriceSetIdIndex.MikroORMIndex(),
    (0, core_1.ManyToOne)(() => price_set_1.default, {
        columnType: "text",
        mapToPk: true,
        fieldName: "price_set_id",
        onDelete: "cascade",
    }),
    __metadata("design:type", String)
], PriceRule.prototype, "price_set_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => price_set_1.default, { persist: false }),
    __metadata("design:type", price_set_1.default)
], PriceRule.prototype, "price_set", void 0);
__decorate([
    PriceRuleRuleTypeIdIndex.MikroORMIndex(),
    (0, core_1.ManyToOne)(() => rule_type_1.default, {
        columnType: "text",
        mapToPk: true,
        fieldName: "rule_type_id",
    }),
    __metadata("design:type", String)
], PriceRule.prototype, "rule_type_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => rule_type_1.default, { persist: false }),
    __metadata("design:type", rule_type_1.default)
], PriceRule.prototype, "rule_type", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], PriceRule.prototype, "value", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "integer", default: 0 }),
    __metadata("design:type", Number)
], PriceRule.prototype, "priority", void 0);
__decorate([
    PriceRulePriceIdIndex.MikroORMIndex(),
    (0, core_1.ManyToOne)(() => price_1.default, {
        columnType: "text",
        mapToPk: true,
        fieldName: "price_id",
        onDelete: "cascade",
    }),
    __metadata("design:type", String)
], PriceRule.prototype, "price_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => price_1.default, { persist: false }),
    __metadata("design:type", price_1.default)
], PriceRule.prototype, "price", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PriceRule.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PriceRule.prototype, "updated_at", void 0);
__decorate([
    PriceRuleDeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], PriceRule.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PriceRule.prototype, "beforeCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PriceRule.prototype, "onInit", null);
PriceRule = __decorate([
    (0, core_1.Entity)({ tableName }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], PriceRule);
exports.default = PriceRule;
