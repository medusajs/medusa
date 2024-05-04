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
const payment_1 = __importDefault(require("./payment"));
const payment_collection_1 = __importDefault(require("./payment-collection"));
let PaymentSession = class PaymentSession {
    constructor() {
        this.data = {};
        this.status = utils_1.PaymentSessionStatus.PENDING;
        this.authorized_at = null;
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "payses");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "payses");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], PaymentSession.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], PaymentSession.prototype, "currency_code", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], PaymentSession.prototype, "amount", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "jsonb",
    }),
    __metadata("design:type", Object)
], PaymentSession.prototype, "raw_amount", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], PaymentSession.prototype, "provider_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], PaymentSession.prototype, "data", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], PaymentSession.prototype, "context", void 0);
__decorate([
    (0, core_1.Enum)({
        items: () => utils_1.PaymentSessionStatus,
    }),
    __metadata("design:type", String)
], PaymentSession.prototype, "status", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], PaymentSession.prototype, "authorized_at", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => payment_collection_1.default, {
        persist: false,
    }),
    __metadata("design:type", payment_collection_1.default)
], PaymentSession.prototype, "payment_collection", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => payment_collection_1.default,
        columnType: "text",
        index: "IDX_payment_session_payment_collection_id",
        fieldName: "payment_collection_id",
        mapToPk: true,
    }),
    __metadata("design:type", String)
], PaymentSession.prototype, "payment_collection_id", void 0);
__decorate([
    (0, core_1.OneToOne)({
        entity: () => payment_1.default,
        nullable: true,
        mappedBy: "payment_session",
    }),
    __metadata("design:type", Object)
], PaymentSession.prototype, "payment", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PaymentSession.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PaymentSession.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
        index: "IDX_payment_session_deleted_at",
    }),
    __metadata("design:type", Object)
], PaymentSession.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentSession.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentSession.prototype, "onInit", null);
PaymentSession = __decorate([
    (0, core_1.Entity)({ tableName: "payment_session" })
], PaymentSession);
exports.default = PaymentSession;
