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
const customer_1 = __importDefault(require("./customer"));
const customer_group_1 = __importDefault(require("./customer-group"));
let CustomerGroupCustomer = class CustomerGroupCustomer {
    constructor() {
        this.metadata = null;
        this.created_by = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "cusgc");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "cusgc");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], CustomerGroupCustomer.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], CustomerGroupCustomer.prototype, "customer_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], CustomerGroupCustomer.prototype, "customer_group_id", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => customer_1.default,
        fieldName: "customer_id",
        index: "IDX_customer_group_customer_customer_id",
        cascade: [core_1.Cascade.REMOVE],
    }),
    __metadata("design:type", customer_1.default)
], CustomerGroupCustomer.prototype, "customer", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => customer_group_1.default,
        fieldName: "customer_group_id",
        index: "IDX_customer_group_customer_group_id",
        cascade: [core_1.Cascade.REMOVE],
    }),
    __metadata("design:type", customer_group_1.default)
], CustomerGroupCustomer.prototype, "customer_group", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], CustomerGroupCustomer.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], CustomerGroupCustomer.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], CustomerGroupCustomer.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], CustomerGroupCustomer.prototype, "created_by", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CustomerGroupCustomer.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CustomerGroupCustomer.prototype, "onInit", null);
CustomerGroupCustomer = __decorate([
    (0, core_1.Entity)({ tableName: "customer_group_customer" })
], CustomerGroupCustomer);
exports.default = CustomerGroupCustomer;
