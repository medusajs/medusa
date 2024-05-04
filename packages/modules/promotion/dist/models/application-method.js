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
const promotion_1 = __importDefault(require("./promotion"));
const promotion_rule_1 = __importDefault(require("./promotion-rule"));
let ApplicationMethod = class ApplicationMethod {
    constructor() {
        this.value = null;
        this.raw_value = null;
        this.max_quantity = null;
        this.apply_to_quantity = null;
        this.buy_rules_min_quantity = null;
        this.target_rules = new core_1.Collection(this);
        this.buy_rules = new core_1.Collection(this);
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "proappmet");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "proappmet");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], ApplicationMethod.prototype, "id", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)({ nullable: true }),
    __metadata("design:type", Object)
], ApplicationMethod.prototype, "value", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], ApplicationMethod.prototype, "raw_value", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "numeric", nullable: true, serializer: Number }),
    __metadata("design:type", Object)
], ApplicationMethod.prototype, "max_quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "numeric", nullable: true, serializer: Number }),
    __metadata("design:type", Object)
], ApplicationMethod.prototype, "apply_to_quantity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "numeric", nullable: true, serializer: Number }),
    __metadata("design:type", Object)
], ApplicationMethod.prototype, "buy_rules_min_quantity", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_application_method_type" }),
    (0, core_1.Enum)(() => utils_1.PromotionUtils.ApplicationMethodType),
    __metadata("design:type", String)
], ApplicationMethod.prototype, "type", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_application_method_target_type" }),
    (0, core_1.Enum)(() => utils_1.PromotionUtils.ApplicationMethodTargetType),
    __metadata("design:type", String)
], ApplicationMethod.prototype, "target_type", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_application_method_allocation" }),
    (0, core_1.Enum)({
        items: () => utils_1.PromotionUtils.ApplicationMethodAllocation,
        nullable: true,
    }),
    __metadata("design:type", String)
], ApplicationMethod.prototype, "allocation", void 0);
__decorate([
    (0, core_1.OneToOne)({
        entity: () => promotion_1.default,
        onDelete: "cascade",
    }),
    __metadata("design:type", promotion_1.default)
], ApplicationMethod.prototype, "promotion", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => promotion_rule_1.default, "method_target_rules", {
        owner: true,
        pivotTable: "application_method_target_rules",
        cascade: ["soft-remove"],
    }),
    __metadata("design:type", Object)
], ApplicationMethod.prototype, "target_rules", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => promotion_rule_1.default, "method_buy_rules", {
        owner: true,
        pivotTable: "application_method_buy_rules",
        cascade: ["soft-remove"],
    }),
    __metadata("design:type", Object)
], ApplicationMethod.prototype, "buy_rules", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ApplicationMethod.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ApplicationMethod.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], ApplicationMethod.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApplicationMethod.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApplicationMethod.prototype, "onInit", null);
ApplicationMethod = __decorate([
    (0, core_1.Entity)({ tableName: "promotion_application_method" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], ApplicationMethod);
exports.default = ApplicationMethod;
