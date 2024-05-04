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
const campaign_1 = __importDefault(require("./campaign"));
let CampaignBudget = class CampaignBudget {
    constructor() {
        this.campaign = null;
        this.limit = null;
        this.raw_limit = null;
        this.used = null;
        this.raw_used = null;
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "probudg");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "probudg");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], CampaignBudget.prototype, "id", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_campaign_budget_type" }),
    (0, core_1.Enum)(() => utils_1.PromotionUtils.CampaignBudgetType),
    __metadata("design:type", String)
], CampaignBudget.prototype, "type", void 0);
__decorate([
    (0, core_1.OneToOne)({
        entity: () => campaign_1.default,
    }),
    __metadata("design:type", Object)
], CampaignBudget.prototype, "campaign", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)({ nullable: true }),
    __metadata("design:type", Object)
], CampaignBudget.prototype, "limit", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], CampaignBudget.prototype, "raw_limit", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)({ nullable: true }),
    __metadata("design:type", Object)
], CampaignBudget.prototype, "used", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], CampaignBudget.prototype, "raw_used", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], CampaignBudget.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], CampaignBudget.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], CampaignBudget.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CampaignBudget.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CampaignBudget.prototype, "onInit", null);
CampaignBudget = __decorate([
    (0, core_1.Entity)({ tableName: "promotion_campaign_budget" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], CampaignBudget);
exports.default = CampaignBudget;
