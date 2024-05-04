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
    tableName: "fulfillment_set",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
const NameIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "fulfillment_set",
    columns: "name",
    unique: true,
    where: "deleted_at IS NULL",
});
let FulfillmentSet = class FulfillmentSet {
    constructor() {
        this.metadata = null;
        this.service_zones = new core_1.Collection(this);
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "fuset");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "fuset");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], FulfillmentSet.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    NameIndex.MikroORMIndex(),
    __metadata("design:type", String)
], FulfillmentSet.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], FulfillmentSet.prototype, "type", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], FulfillmentSet.prototype, "metadata", void 0);
__decorate([
    (0, core_1.OneToMany)(() => service_zone_1.default, "fulfillment_set", {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
        orphanRemoval: true,
    }),
    __metadata("design:type", Object)
], FulfillmentSet.prototype, "service_zones", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], FulfillmentSet.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], FulfillmentSet.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    DeletedAtIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], FulfillmentSet.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FulfillmentSet.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FulfillmentSet.prototype, "onInit", null);
FulfillmentSet = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], FulfillmentSet);
exports.default = FulfillmentSet;
