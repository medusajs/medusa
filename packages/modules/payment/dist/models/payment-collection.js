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
const payment_provider_1 = __importDefault(require("./payment-provider"));
const payment_session_1 = __importDefault(require("./payment-session"));
let PaymentCollection = class PaymentCollection {
    constructor() {
        this.deleted_at = null;
        this.completed_at = null;
        this.status = utils_1.PaymentCollectionStatus.NOT_PAID;
        this.payment_providers = new core_1.Collection(this);
        this.payment_sessions = new core_1.Collection(this);
        this.payments = new core_1.Collection(this);
        this.metadata = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "pay_col");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "pay_col");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], PaymentCollection.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], PaymentCollection.prototype, "currency_code", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], PaymentCollection.prototype, "amount", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], PaymentCollection.prototype, "raw_amount", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", index: "IDX_payment_collection_region_id" }),
    __metadata("design:type", String)
], PaymentCollection.prototype, "region_id", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PaymentCollection.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], PaymentCollection.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
        index: "IDX_payment_collection_deleted_at",
    }),
    __metadata("design:type", Object)
], PaymentCollection.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
    }),
    __metadata("design:type", Object)
], PaymentCollection.prototype, "completed_at", void 0);
__decorate([
    (0, core_1.Enum)({
        items: () => utils_1.PaymentCollectionStatus,
        default: utils_1.PaymentCollectionStatus.NOT_PAID,
    }),
    __metadata("design:type", String)
], PaymentCollection.prototype, "status", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => payment_provider_1.default),
    __metadata("design:type", Object)
], PaymentCollection.prototype, "payment_providers", void 0);
__decorate([
    (0, core_1.OneToMany)(() => payment_session_1.default, (ps) => ps.payment_collection, {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
    }),
    __metadata("design:type", Object)
], PaymentCollection.prototype, "payment_sessions", void 0);
__decorate([
    (0, core_1.OneToMany)(() => payment_1.default, (payment) => payment.payment_collection, {
        cascade: [core_1.Cascade.PERSIST, "soft-remove"],
    }),
    __metadata("design:type", Object)
], PaymentCollection.prototype, "payments", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], PaymentCollection.prototype, "metadata", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentCollection.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentCollection.prototype, "onInit", null);
PaymentCollection = __decorate([
    (0, core_1.Entity)({ tableName: "payment_collection" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], PaymentCollection);
exports.default = PaymentCollection;
