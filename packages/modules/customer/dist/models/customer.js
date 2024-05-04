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
const address_1 = __importDefault(require("./address"));
const customer_group_1 = __importDefault(require("./customer-group"));
const customer_group_customer_1 = __importDefault(require("./customer-group-customer"));
let Customer = class Customer {
    constructor() {
        this.company_name = null;
        this.first_name = null;
        this.last_name = null;
        this.email = null;
        this.phone = null;
        this.has_account = false;
        this.metadata = null;
        this.groups = new core_1.Collection(this);
        this.addresses = new core_1.Collection(this);
        this.deleted_at = null;
        this.created_by = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "cus");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "cus");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Customer.prototype, "id", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "company_name", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "first_name", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "last_name", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "email", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Customer.prototype, "has_account", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "metadata", void 0);
__decorate([
    (0, core_1.ManyToMany)({
        mappedBy: "customers",
        entity: () => customer_group_1.default,
        pivotEntity: () => customer_group_customer_1.default,
    }),
    __metadata("design:type", Object)
], Customer.prototype, "groups", void 0);
__decorate([
    (0, core_1.OneToMany)(() => address_1.default, (address) => address.customer, {
        cascade: [core_1.Cascade.REMOVE],
    }),
    __metadata("design:type", Object)
], Customer.prototype, "addresses", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Customer.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Customer.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "created_by", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Customer.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Customer.prototype, "onInit", null);
Customer = __decorate([
    (0, core_1.Entity)({ tableName: "customer" }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], Customer);
exports.default = Customer;
