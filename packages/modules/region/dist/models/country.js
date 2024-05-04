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
const core_1 = require("@mikro-orm/core");
const utils_1 = require("@medusajs/utils");
const region_1 = __importDefault(require("./region"));
// We don't need a partial index on deleted_at here since we don't support soft deletes on countries
const regionIdIsoIndexName = "IDX_region_country_region_id_iso_2_unique";
const RegionIdIsoIndexStatement = (0, utils_1.createPsqlIndexStatementHelper)({
    name: regionIdIsoIndexName,
    tableName: "region_country",
    columns: ["region_id", "iso_2"],
    unique: true,
});
RegionIdIsoIndexStatement.MikroORMIndex();
let Country = class Country {
    constructor() {
        this.region_id = null;
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Country.prototype, "iso_2", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Country.prototype, "iso_3", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "int" }),
    __metadata("design:type", Number)
], Country.prototype, "num_code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Country.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Country.prototype, "display_name", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Country.prototype, "region_id", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => region_1.default,
        fieldName: "region_id",
        nullable: true,
        onDelete: "set null",
    }),
    __metadata("design:type", Object)
], Country.prototype, "region", void 0);
Country = __decorate([
    (0, core_1.Entity)({ tableName: "region_country" })
], Country);
exports.default = Country;
