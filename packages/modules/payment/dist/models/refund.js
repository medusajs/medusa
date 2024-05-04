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
let Refund = class Refund {
    constructor() {
        this.deleted_at = null;
        this.created_by = null;
        this.metadata = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ref");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "ref");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Refund.prototype, "id", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)(),
    __metadata("design:type", Object)
], Refund.prototype, "amount", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], Refund.prototype, "raw_amount", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => payment_1.default, {
        onDelete: "cascade",
        index: "IDX_refund_payment_id",
        fieldName: "payment_id",
    }),
    __metadata("design:type", payment_1.default)
], Refund.prototype, "payment", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Refund.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Refund.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({
        columnType: "timestamptz",
        nullable: true,
        index: "IDX_refund_deleted_at",
    }),
    __metadata("design:type", Object)
], Refund.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Refund.prototype, "created_by", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Refund.prototype, "metadata", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Refund.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Refund.prototype, "onInit", null);
Refund = __decorate([
    (0, core_1.Entity)({ tableName: "refund" })
], Refund);
exports.default = Refund;
