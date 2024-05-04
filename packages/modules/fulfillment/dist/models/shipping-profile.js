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
const shipping_option_1 = __importDefault(require("./shipping-option"));
const DeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "shipping_profile",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
const ShippingProfileTypeIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "shipping_profile",
    columns: "name",
    unique: true,
    where: "deleted_at IS NULL",
});
let ShippingProfile = class ShippingProfile {
    constructor() {
        this.shipping_options = new core_1.Collection(this);
        this.metadata = null;
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "sp");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "sp");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], ShippingProfile.prototype, "id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    ShippingProfileTypeIndex.MikroORMIndex(),
    __metadata("design:type", String)
], ShippingProfile.prototype, "name", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], ShippingProfile.prototype, "type", void 0);
__decorate([
    (0, core_1.OneToMany)(() => shipping_option_1.default, (shippingOption) => shippingOption.shipping_profile),
    __metadata("design:type", Object)
], ShippingProfile.prototype, "shipping_options", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], ShippingProfile.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ShippingProfile.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], ShippingProfile.prototype, "updated_at", void 0);
__decorate([
    DeletedAtIndex.MikroORMIndex(),
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], ShippingProfile.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingProfile.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingProfile.prototype, "onInit", null);
ShippingProfile = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], ShippingProfile);
exports.default = ShippingProfile;
