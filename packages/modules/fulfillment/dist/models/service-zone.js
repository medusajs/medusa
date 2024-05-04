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
const fulfillment_set_1 = __importDefault(require("./fulfillment-set"));
const geo_zone_1 = __importDefault(require("./geo-zone"));
const shipping_option_1 = __importDefault(require("./shipping-option"));
const deletedAtIndexName = "IDX_service_zone_deleted_at";
const deletedAtIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: deletedAtIndexName,
    tableName: "service_zone",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
}).expression;
const NameIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "service_zone",
    columns: "name",
    unique: true,
    where: "deleted_at IS NULL",
});
const FulfillmentSetIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "service_zone",
    columns: "fulfillment_set_id",
    where: "deleted_at IS NULL",
});
let ServiceZone = class ServiceZone {
    constructor() {
        this.metadata = null;
        this.geo_zones = new core_1.Collection(this);
        this.shipping_options = new core_1.Collection(this);
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "serzo");
        this.fulfillment_set_id ?? (this.fulfillment_set_id = this.fulfillment_set?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "serzo");
        this.fulfillment_set_id ?? (this.fulfillment_set_id = this.fulfillment_set?.id);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], ServiceZone.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    NameIndex.MikroORMIndex(),
    __metadata("design:type", String)
], ServiceZone.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], ServiceZone.prototype, "metadata", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => fulfillment_set_1.default, {
        type: "text",
        mapToPk: true,
        fieldName: "fulfillment_set_id",
        onDelete: "cascade",
    }),
    FulfillmentSetIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], ServiceZone.prototype, "fulfillment_set_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => fulfillment_set_1.default, { persist: false }),
    __metadata("design:type", fulfillment_set_1.default)
], ServiceZone.prototype, "fulfillment_set", void 0);
__decorate([
    (0, core_1.OneToMany)(() => geo_zone_1.default, "service_zone", {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
        orphanRemoval: true,
    }),
    __metadata("design:type", Object)
], ServiceZone.prototype, "geo_zones", void 0);
__decorate([
    (0, core_1.OneToMany)(() => shipping_option_1.default, (shippingOption) => shippingOption.service_zone, {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
        orphanRemoval: true,
    }),
    __metadata("design:type", Object)
], ServiceZone.prototype, "shipping_options", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ServiceZone.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ServiceZone.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Index)({
        name: deletedAtIndexName,
        expression: deletedAtIndexStatement,
    }),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], ServiceZone.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceZone.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceZone.prototype, "onInit", null);
ServiceZone = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], ServiceZone);
exports.default = ServiceZone;
