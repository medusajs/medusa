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
const price_set_1 = __importDefault(require("./price-set"));
const tableName = "rule_type";
const RuleTypeDeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
const RuleTypeRuleAttributeIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "rule_attribute",
    where: "deleted_at IS NULL",
});
let RuleType = class RuleType {
    constructor() {
        this.price_sets = new core_1.Collection(this);
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "rul-typ");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "rul-typ");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], RuleType.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], RuleType.prototype, "name", void 0);
__decorate([
    RuleTypeRuleAttributeIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], RuleType.prototype, "rule_attribute", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "integer", default: 0 }),
    __metadata("design:type", Number)
], RuleType.prototype, "default_priority", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => price_set_1.default, (priceSet) => priceSet.rule_types),
    __metadata("design:type", Object)
], RuleType.prototype, "price_sets", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], RuleType.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], RuleType.prototype, "updated_at", void 0);
__decorate([
    RuleTypeDeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], RuleType.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuleType.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuleType.prototype, "onInit", null);
RuleType = __decorate([
    (0, core_1.Entity)({ tableName }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], RuleType);
exports.default = RuleType;
