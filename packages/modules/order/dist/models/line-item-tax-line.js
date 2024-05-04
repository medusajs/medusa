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
const line_item_1 = __importDefault(require("./line-item"));
const tax_line_1 = __importDefault(require("./tax-line"));
const ItemIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_line_item_tax_line",
    columns: "item_id",
});
let LineItemTaxLine = class LineItemTaxLine extends tax_line_1.default {
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordlitxl");
        this.item_id ?? (this.item_id = this.item?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordlitxl");
        this.item_id ?? (this.item_id = this.item?.id);
    }
};
__decorate([
    (0, core_1.ManyToOne)(() => line_item_1.default, {
        fieldName: "item_id",
        persist: false,
    }),
    __metadata("design:type", line_item_1.default)
], LineItemTaxLine.prototype, "item", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => line_item_1.default,
        columnType: "text",
        fieldName: "item_id",
        cascade: [core_1.Cascade.PERSIST, core_1.Cascade.REMOVE],
        mapToPk: true,
    }),
    ItemIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], LineItemTaxLine.prototype, "item_id", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LineItemTaxLine.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LineItemTaxLine.prototype, "onInit", null);
LineItemTaxLine = __decorate([
    (0, core_1.Entity)({ tableName: "order_line_item_tax_line" })
], LineItemTaxLine);
exports.default = LineItemTaxLine;
//# sourceMappingURL=line-item-tax-line.js.map