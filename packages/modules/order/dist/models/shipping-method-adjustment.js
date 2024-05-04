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
const adjustment_line_1 = __importDefault(require("./adjustment-line"));
const shipping_method_1 = __importDefault(require("./shipping-method"));
const ShippingMethodIdIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_shipping_method_adjustment",
    columns: "shipping_method_id",
});
let ShippingMethodAdjustment = class ShippingMethodAdjustment extends adjustment_line_1.default {
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordsmadj");
        this.shipping_method_id ?? (this.shipping_method_id = this.shipping_method?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordsmadj");
        this.shipping_method_id ?? (this.shipping_method_id = this.shipping_method?.id);
    }
};
__decorate([
    (0, core_1.ManyToOne)(() => shipping_method_1.default, {
        persist: false,
    }),
    __metadata("design:type", shipping_method_1.default)
], ShippingMethodAdjustment.prototype, "shipping_method", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => shipping_method_1.default,
        columnType: "text",
        fieldName: "shipping_method_id",
        mapToPk: true,
        onDelete: "cascade",
    }),
    ShippingMethodIdIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], ShippingMethodAdjustment.prototype, "shipping_method_id", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingMethodAdjustment.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingMethodAdjustment.prototype, "onInit", null);
ShippingMethodAdjustment = __decorate([
    (0, core_1.Entity)({ tableName: "order_shipping_method_adjustment" })
], ShippingMethodAdjustment);
exports.default = ShippingMethodAdjustment;
//# sourceMappingURL=shipping-method-adjustment.js.map