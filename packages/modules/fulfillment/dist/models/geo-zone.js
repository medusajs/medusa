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
const service_zone_1 = __importDefault(require("./service-zone"));
const DeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "geo_zone",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
const CountryCodeIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "geo_zone",
    columns: "country_code",
    where: "deleted_at IS NULL",
});
const ProvinceCodeIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "geo_zone",
    columns: "province_code",
    where: "deleted_at IS NULL AND province_code IS NOT NULL",
});
const CityIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "geo_zone",
    columns: "city",
    where: "deleted_at IS NULL AND city IS NOT NULL",
});
const ServiceZoneIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "geo_zone",
    columns: "service_zone_id",
    where: "deleted_at IS NULL",
});
let GeoZone = class GeoZone {
    constructor() {
        this.province_code = null;
        this.city = null;
        this.postal_expression = null;
        this.metadata = null;
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, " fgz");
        this.service_zone_id ?? (this.service_zone_id = this.service_zone?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "fgz");
        this.service_zone_id ?? (this.service_zone_id = this.service_zone?.id);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], GeoZone.prototype, "id", void 0);
__decorate([
    (0, core_1.Enum)({ items: () => utils_1.GeoZoneType, default: utils_1.GeoZoneType.COUNTRY }),
    __metadata("design:type", String)
], GeoZone.prototype, "type", void 0);
__decorate([
    CountryCodeIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], GeoZone.prototype, "country_code", void 0);
__decorate([
    ProvinceCodeIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], GeoZone.prototype, "province_code", void 0);
__decorate([
    CityIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], GeoZone.prototype, "city", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => service_zone_1.default, {
        type: "text",
        mapToPk: true,
        fieldName: "service_zone_id",
        onDelete: "cascade",
    }),
    ServiceZoneIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], GeoZone.prototype, "service_zone_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], GeoZone.prototype, "postal_expression", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], GeoZone.prototype, "metadata", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => service_zone_1.default, {
        persist: false,
    }),
    __metadata("design:type", service_zone_1.default)
], GeoZone.prototype, "service_zone", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], GeoZone.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], GeoZone.prototype, "updated_at", void 0);
__decorate([
    DeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], GeoZone.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GeoZone.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GeoZone.prototype, "onInit", null);
GeoZone = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], GeoZone);
exports.default = GeoZone;
