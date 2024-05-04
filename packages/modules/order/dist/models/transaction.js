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
const ReferenceIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_transaction",
    columns: "reference_id",
});
const OrderIdIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_transaction",
    columns: "order_id",
});
const CurrencyCodeIndex = (0, utils_1.createPsqlIndexStatementHelper)({
    tableName: "order_transaction",
    columns: "currency_code",
});
let Transaction = class Transaction {
    constructor() {
        this.reference = null;
        this.reference_id = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordtrx");
        this.order_id ?? (this.order_id = this.order?.id);
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ordtrx");
        this.order_id ?? (this.order_id = this.order?.id);
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Transaction.prototype, "id", void 0);
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
], Transaction.prototype, "order_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => order_1.default, {
        persist: false,
    }),
    __metadata("design:type", order_1.default)
], Transaction.prototype, "order", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], Transaction.prototype, "raw_amount", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    CurrencyCodeIndex.MikroORMIndex(),
    __metadata("design:type", String)
], Transaction.prototype, "currency_code", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "text",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "reference", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "text",
        nullable: true,
    }),
    ReferenceIdIndex.MikroORMIndex(),
    __metadata("design:type", Object)
], Transaction.prototype, "reference_id", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Transaction.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Transaction.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Transaction.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Transaction.prototype, "onInit", null);
Transaction = __decorate([
    (0, core_1.Entity)({ tableName: "order_transaction" })
], Transaction);
exports.default = Transaction;
//# sourceMappingURL=transaction.js.map