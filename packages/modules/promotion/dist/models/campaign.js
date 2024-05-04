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
const campaign_budget_1 = __importDefault(require("./campaign-budget"));
const promotion_1 = __importDefault(require("./promotion"));
let Campaign = class Campaign {
    constructor() {
        this.description = null;
        this.currency = null;
        this.starts_at = null;
        this.ends_at = null;
        this.budget = null;
        this.promotions = new core_1.Collection(this);
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "procamp");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "procamp");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Campaign.prototype, "id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Campaign.prototype, "name", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Campaign.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Campaign.prototype, "currency", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    (0, core_1.Unique)({
        name: "IDX_campaign_identifier_unique",
        properties: ["campaign_identifier"],
    }),
    __metadata("design:type", String)
], Campaign.prototype, "campaign_identifier", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Campaign.prototype, "starts_at", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Campaign.prototype, "ends_at", void 0);
__decorate([
    (0, core_1.OneToOne)({
        entity: () => campaign_budget_1.default,
        mappedBy: (cb) => cb.campaign,
        cascade: ["soft-remove"],
        nullable: true,
    }),
    __metadata("design:type", Object)
], Campaign.prototype, "budget", void 0);
__decorate([
    (0, core_1.OneToMany)(() => promotion_1.default, (promotion) => promotion.campaign, {
        orphanRemoval: true,
    }),
    __metadata("design:type", Object)
], Campaign.prototype, "promotions", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Campaign.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Campaign.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], Campaign.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Campaign.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Campaign.prototype, "onInit", null);
Campaign = __decorate([
    (0, core_1.Entity)({ tableName: "promotion_campaign" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], Campaign);
exports.default = Campaign;
