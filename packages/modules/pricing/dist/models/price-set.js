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
exports.PriceSetIdPrefix = void 0;
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const price_1 = __importDefault(require("./price"));
const price_rule_1 = __importDefault(require("./price-rule"));
const price_set_rule_type_1 = __importDefault(require("./price-set-rule-type"));
const rule_type_1 = __importDefault(require("./rule-type"));
const tableName = "price_set";
const PriceSetDeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: tableName,
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
exports.PriceSetIdPrefix = "pset";
let PriceSet = class PriceSet {
    constructor() {
        this.prices = new core_1.Collection(this);
        this.price_rules = new core_1.Collection(this);
        this.rule_types = new core_1.Collection(this);
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, exports.PriceSetIdPrefix);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, exports.PriceSetIdPrefix);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], PriceSet.prototype, "id", void 0);
__decorate([
    (0, core_1.OneToMany)(() => price_1.default, (price) => price.price_set, {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
    }),
    __metadata("design:type", Object)
], PriceSet.prototype, "prices", void 0);
__decorate([
    (0, core_1.OneToMany)(() => price_rule_1.default, (pr) => pr.price_set, {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
    }),
    __metadata("design:type", Object)
], PriceSet.prototype, "price_rules", void 0);
__decorate([
    (0, core_1.ManyToMany)({
        entity: () => rule_type_1.default,
        pivotEntity: () => price_set_rule_type_1.default,
        cascade: ["soft-remove"],
    }),
    __metadata("design:type", Object)
], PriceSet.prototype, "rule_types", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PriceSet.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PriceSet.prototype, "updated_at", void 0);
__decorate([
    PriceSetDeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], PriceSet.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PriceSet.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PriceSet.prototype, "onInit", null);
PriceSet = __decorate([
    (0, core_1.Entity)({ tableName }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], PriceSet);
exports.default = PriceSet;
