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
const line_item_1 = __importDefault(require("./line-item"));
const ItemIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_line_item_adjustment",
    columns: "item_id",
});
let LineItemAdjustment = class LineItemAdjustment extends adjustment_line_1.default {
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordliadj");
        this.item_id ?? (this.item_id = this.item?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordliadj");
        this.item_id ?? (this.item_id = this.item?.id);
    }
};
__decorate([
    (0, core_1.ManyToOne)(() => line_item_1.default, {
        persist: false,
    }),
    __metadata("design:type", line_item_1.default)
], LineItemAdjustment.prototype, "item", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => line_item_1.default,
        columnType: "text",
        fieldName: "item_id",
        onDelete: "cascade",
        mapToPk: true,
    }),
    ItemIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], LineItemAdjustment.prototype, "item_id", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LineItemAdjustment.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LineItemAdjustment.prototype, "onInit", null);
LineItemAdjustment = __decorate([
    (0, core_1.Entity)({ tableName: "order_line_item_adjustment" })
], LineItemAdjustment);
exports.default = LineItemAdjustment;
//# sourceMappingURL=line-item-adjustment.js.map