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
const capture_1 = __importDefault(require("./capture"));
const payment_collection_1 = __importDefault(require("./payment-collection"));
const payment_session_1 = __importDefault(require("./payment-session"));
const refund_1 = __importDefault(require("./refund"));
let Payment = class Payment {
    constructor() {
        this.cart_id = null;
        this.order_id = null;
        this.customer_id = null;
        this.data = null;
        this.metadata = null;
        this.deleted_at = null;
        this.captured_at = null;
        this.canceled_at = null;
        this.refunds = new core_1.Collection(this);
        this.captures = new core_1.Collection(this);
    }
    /** COMPUTED PROPERTIES END **/
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "pay");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "pay");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], Payment.prototype, "raw_amount", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Payment.prototype, "currency_code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Payment.prototype, "provider_id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "cart_id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "order_id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "customer_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "data", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Payment.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Payment.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
        index: "IDX_payment_deleted_at",
    }),
    __metadata("design:type", Object)
], Payment.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Payment.prototype, "captured_at", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Payment.prototype, "canceled_at", void 0);
__decorate([
    (0, core_1.OneToMany)(() => refund_1.default, (refund) => refund.payment, {
        cascade: [core_1.Cascade.REMOVE],
    }),
    __metadata("design:type", Object)
], Payment.prototype, "refunds", void 0);
__decorate([
    (0, core_1.OneToMany)(() => capture_1.default, (capture) => capture.payment, {
        cascade: [core_1.Cascade.REMOVE],
    }),
    __metadata("design:type", Object)
], Payment.prototype, "captures", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => payment_collection_1.default,
        persist: false,
    }),
    __metadata("design:type", payment_collection_1.default)
], Payment.prototype, "payment_collection", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => payment_collection_1.default,
        columnType: "text",
        index: "IDX_payment_payment_collection_id",
        fieldName: "payment_collection_id",
        mapToPk: true,
    }),
    __metadata("design:type", String)
], Payment.prototype, "payment_collection_id", void 0);
__decorate([
    (0, core_1.OneToOne)({
        owner: true,
        fieldName: "payment_session_id",
        index: "IDX_payment_payment_session_id",
    }),
    __metadata("design:type", payment_session_1.default
    /** COMPUTED PROPERTIES START **/
    )
], Payment.prototype, "payment_session", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Payment.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Payment.prototype, "onInit", null);
Payment = __decorate([
    (0, core_1.Entity)({ tableName: "payment" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], Payment);
exports.default = Payment;
