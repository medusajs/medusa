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
const order_1 = __importDefault(require("./order"));
const order_change_action_1 = __importDefault(require("./order-change-action"));
const OrderIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_change",
    columns: "order_id",
});
const OrderChangeStatusIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_change",
    columns: "status",
});
const VersionIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_change",
    columns: ["order_id", "version"],
});
let OrderChange = class OrderChange {
    constructor() {
        this.actions = new core_1.Collection(this);
        this.description = null;
        this.status = utils_1.OrderChangeStatus.PENDING;
        this.internal_note = null;
        this.requested_by = null; // customer or user ID
        this.requested_at = null;
        this.confirmed_by = null; // customer or user ID
        this.confirmed_at = null;
        this.declined_by = null; // customer or user ID
        this.declined_reason = null;
        this.metadata = null;
        this.canceled_by = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordch");
        this.order_id ?? (this.order_id = this.order?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordch");
        this.order_id ?? (this.order_id = this.order?.id);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], OrderChange.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => order_1.default,
        columnType: "text",
        fieldName: "order_id",
        onDelete: "cascade",
        mapToPk: true,
    }),
    OrderIdIndex.MikroORMIndex(),
    __metadata("design:type", String)
], OrderChange.prototype, "order_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => order_1.default, {
        persist: false,
    }),
    __metadata("design:type", order_1.default)
], OrderChange.prototype, "order", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "integer" }),
    VersionIndex.MikroORMIndex(),
    __metadata("design:type", Number)
], OrderChange.prototype, "version", void 0);
__decorate([
    (0, core_1.OneToMany)(() => order_change_action_1.default, (action) => action.order_change, {
        cascade: [core_1.Cascade.PERSIST, "sotf-remove"],
    }),
    __metadata("design:type", Object)
], OrderChange.prototype, "actions", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "text",
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderChange.prototype, "description", void 0);
__decorate([
    (0, core_1.Enum)({ items: () => utils_1.OrderChangeStatus, default: utils_1.OrderChangeStatus.PENDING }),
    OrderChangeStatusIndex.MikroORMIndex(),
    __metadata("design:type", String)
], OrderChange.prototype, "status", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], OrderChange.prototype, "internal_note", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", String)
], OrderChange.prototype, "created_by", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], OrderChange.prototype, "requested_by", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderChange.prototype, "requested_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], OrderChange.prototype, "confirmed_by", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderChange.prototype, "confirmed_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], OrderChange.prototype, "declined_by", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], OrderChange.prototype, "declined_reason", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], OrderChange.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Date)
], OrderChange.prototype, "declined_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], OrderChange.prototype, "canceled_by", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Date)
], OrderChange.prototype, "canceled_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], OrderChange.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], OrderChange.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderChange.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderChange.prototype, "onInit", null);
OrderChange = __decorate([
    (0, core_1.Entity)({ tableName: "order_change" }),
    VersionIndex.MikroORMIndex()
], OrderChange);
exports.default = OrderChange;
//# sourceMappingURL=order-change.js.map