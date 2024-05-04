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
exports.uniqueRateReferenceIndexName = void 0;
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const tax_rate_1 = __importDefault(require("./tax-rate"));
const TABLE_NAME = "tax_rate_rule";
const taxRateIdIndexName = "IDX_tax_rate_rule_tax_rate_id";
const taxRateIdIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: taxRateIdIndexName,
    tableName: TABLE_NAME,
    columns: "tax_rate_id",
    where: "deleted_at IS NULL",
});
const referenceIdIndexName = "IDX_tax_rate_rule_reference_id";
const referenceIdIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: referenceIdIndexName,
    tableName: TABLE_NAME,
    columns: "reference_id",
    where: "deleted_at IS NULL",
});
exports.uniqueRateReferenceIndexName = "IDX_tax_rate_rule_unique_rate_reference";
const uniqueRateReferenceIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: exports.uniqueRateReferenceIndexName,
    tableName: TABLE_NAME,
    columns: ["tax_rate_id", "reference_id"],
    unique: true,
    where: "deleted_at IS NULL",
});
let TaxRateRule = class TaxRateRule {
    constructor() {
        this.metadata = null;
        this.created_by = null;
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "txrule");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "txrule");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], TaxRateRule.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => tax_rate_1.default, {
        type: "text",
        fieldName: "tax_rate_id",
        mapToPk: true,
        onDelete: "cascade",
    }),
    taxRateIdIndexStatement.MikroORMIndex(),
    __metadata("design:type", String)
], TaxRateRule.prototype, "tax_rate_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    referenceIdIndexStatement.MikroORMIndex(),
    __metadata("design:type", String)
], TaxRateRule.prototype, "reference_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], TaxRateRule.prototype, "reference", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => tax_rate_1.default, { persist: false }),
    __metadata("design:type", tax_rate_1.default)
], TaxRateRule.prototype, "tax_rate", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], TaxRateRule.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], TaxRateRule.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], TaxRateRule.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], TaxRateRule.prototype, "created_by", void 0);
__decorate([
    (0, utils_1.createPsqlIndexStatementHelper)({
        tableName: TABLE_NAME,
        columns: "deleted_at",
        where: "deleted_at IS NOT NULL",
    }).MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], TaxRateRule.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaxRateRule.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaxRateRule.prototype, "onInit", null);
TaxRateRule = __decorate([
    (0, core_1.Entity)({ tableName: TABLE_NAME }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions),
    uniqueRateReferenceIndexStatement.MikroORMIndex()
], TaxRateRule);
exports.default = TaxRateRule;
