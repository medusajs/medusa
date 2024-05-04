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
const campaign_1 = __importDefault(require("./campaign"));
const promotion_rule_1 = __importDefault(require("./promotion-rule"));
let Promotion = class Promotion {
    constructor() {
        this.campaign = null;
        this.is_automatic = false;
        this.rules = new core_1.Collection(this);
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "promo");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "promo");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Promotion.prototype, "id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    (0, core_1.Index)({ name: "IDX_promotion_code" }),
    (0, core_1.Unique)({
        name: "IDX_promotion_code_unique",
        properties: ["code"],
    }),
    __metadata("design:type", String)
], Promotion.prototype, "code", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.ManyToOne)(() => campaign_1.default, {
        fieldName: "campaign_id",
        nullable: true,
        cascade: ["soft-remove"],
    }),
    __metadata("design:type", Object)
], Promotion.prototype, "campaign", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Promotion.prototype, "is_automatic", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_promotion_type" }),
    (0, core_1.Enum)(() => utils_1.PromotionUtils.PromotionType),
    __metadata("design:type", String)
], Promotion.prototype, "type", void 0);
__decorate([
    (0, core_1.OneToOne)({
        entity: () => application_method_1.default,
        mappedBy: (am) => am.promotion,
        cascade: ["soft-remove"],
    }),
    __metadata("design:type", application_method_1.default)
], Promotion.prototype, "application_method", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => promotion_rule_1.default, "promotions", {
        owner: true,
        pivotTable: "promotion_promotion_rule",
        cascade: ["soft-remove"],
    }),
    __metadata("design:type", Object)
], Promotion.prototype, "rules", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Promotion.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Promotion.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], Promotion.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Promotion.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Promotion.prototype, "onInit", null);
Promotion = __decorate([
    (0, core_1.Entity)({ tableName: "promotion" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], Promotion);
exports.default = Promotion;
