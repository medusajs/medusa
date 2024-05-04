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
const application_method_1 = __importDefault(require("./application-method"));
const promotion_1 = __importDefault(require("./promotion"));
const promotion_rule_value_1 = __importDefault(require("./promotion-rule-value"));
let PromotionRule = class PromotionRule {
    constructor() {
        this.description = null;
        this.values = new core_1.Collection(this);
        this.promotions = new core_1.Collection(this);
        this.method_target_rules = new core_1.Collection(this);
        this.method_buy_rules = new core_1.Collection(this);
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "prorul");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "prorul");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], PromotionRule.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], PromotionRule.prototype, "description", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_promotion_rule_attribute" }),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], PromotionRule.prototype, "attribute", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_promotion_rule_operator" }),
    (0, core_1.Enum)(() => utils_1.PromotionUtils.PromotionRuleOperator),
    __metadata("design:type", String)
], PromotionRule.prototype, "operator", void 0);
__decorate([
    (0, core_1.OneToMany)(() => promotion_rule_value_1.default, (prv) => prv.promotion_rule, {
        cascade: [core_1.Cascade.REMOVE],
    }),
    __metadata("design:type", Object)
], PromotionRule.prototype, "values", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => promotion_1.default, (promotion) => promotion.rules),
    __metadata("design:type", Object)
], PromotionRule.prototype, "promotions", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => application_method_1.default, (applicationMethod) => applicationMethod.target_rules),
    __metadata("design:type", Object)
], PromotionRule.prototype, "method_target_rules", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => application_method_1.default, (applicationMethod) => applicationMethod.buy_rules),
    __metadata("design:type", Object)
], PromotionRule.prototype, "method_buy_rules", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PromotionRule.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PromotionRule.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], PromotionRule.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromotionRule.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromotionRule.prototype, "onInit", null);
PromotionRule = __decorate([
    (0, core_1.Entity)({ tableName: "promotion_rule" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], PromotionRule);
exports.default = PromotionRule;
