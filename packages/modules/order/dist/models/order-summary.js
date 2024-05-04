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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const _models_1 = require(".");
const OrderIdVersionIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_summary",
    columns: ["order_id", "version"],
    where: "deleted_at IS NOT NULL",
});
const DeletedAtIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
});
let OrderSummary = class OrderSummary {
    constructor() {
        this.version = 1;
        this.totals = {};
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordsum");
        this.order_id ?? (this.order_id = this.order?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordsum");
        this.order_id ?? (this.order_id = this.order?.id);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], OrderSummary.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => _models_1.Order,
        columnType: "text",
        fieldName: "order_id",
        mapToPk: true,
        onDelete: "cascade",
    }),
    __metadata("design:type", String)
], OrderSummary.prototype, "order_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => _models_1.Order, {
        persist: false,
    }),
    __metadata("design:type", _models_1.Order)
], OrderSummary.prototype, "order", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "integer",
        defaultRaw: "1",
    }),
    __metadata("design:type", Number)
], OrderSummary.prototype, "version", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], OrderSummary.prototype, "totals", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], OrderSummary.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], OrderSummary.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    DeletedAtIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], OrderSummary.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderSummary.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderSummary.prototype, "onInit", null);
OrderSummary = __decorate([
    (0, core_1.Entity)({ tableName: "order_summary" }),
    OrderIdVersionIndex.MikroORMIndex()
], OrderSummary);
exports.default = OrderSummary;
//# sourceMappingURL=order-summary.js.map