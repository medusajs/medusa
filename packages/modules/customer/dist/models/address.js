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
exports.UNIQUE_CUSTOMER_BILLING_ADDRESS = exports.UNIQUE_CUSTOMER_SHIPPING_ADDRESS = void 0;
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const customer_1 = __importDefault(require("./customer"));
exports.UNIQUE_CUSTOMER_SHIPPING_ADDRESS = "IDX_customer_address_unique_customer_shipping";
exports.UNIQUE_CUSTOMER_BILLING_ADDRESS = "IDX_customer_address_unique_customer_billing";
let Address = class Address {
    constructor() {
        this.address_name = null;
        this.is_default_shipping = false;
        this.is_default_billing = false;
        this.company = null;
        this.first_name = null;
        this.last_name = null;
        this.address_1 = null;
        this.address_2 = null;
        this.city = null;
        this.country_code = null;
        this.province = null;
        this.postal_code = null;
        this.phone = null;
        this.metadata = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "cuaddr");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "cuaddr");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Address.prototype, "id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "address_name", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Address.prototype, "is_default_shipping", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Address.prototype, "is_default_billing", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Address.prototype, "customer_id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => customer_1.default, {
        fieldName: "customer_id",
        index: "IDX_customer_address_customer_id",
        cascade: [core_1.Cascade.REMOVE, core_1.Cascade.PERSIST],
    }),
    __metadata("design:type", customer_1.default)
], Address.prototype, "customer", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "company", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "first_name", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "last_name", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "address_1", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "address_2", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "city", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "country_code", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "province", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "postal_code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "phone", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "metadata", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Address.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Address.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Address.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Address.prototype, "onInit", null);
Address = __decorate([
    (0, core_1.Entity)({ tableName: "customer_address" }),
    (0, core_1.Index)({
        name: exports.UNIQUE_CUSTOMER_SHIPPING_ADDRESS,
        expression: 'create unique index "IDX_customer_address_unique_customer_shipping" on "customer_address" ("customer_id") where "is_default_shipping" = true',
    }),
    (0, core_1.Index)({
        name: exports.UNIQUE_CUSTOMER_BILLING_ADDRESS,
        expression: 'create unique index "IDX_customer_address_unique_customer_billing" on "customer_address" ("customer_id") where "is_default_billing" = true',
    })
], Address);
exports.default = Address;
