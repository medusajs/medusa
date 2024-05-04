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
let Currency = class Currency {
};
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], Currency.prototype, "code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Currency.prototype, "symbol", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Currency.prototype, "symbol_native", void 0);
__decorate([
    (0, utils_1.Searchable)(),
    (0, core_1.Property)({ columnType: "text" }),
    __metadata("design:type", String)
], Currency.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "int", default: 0 }),
    __metadata("design:type", Number)
], Currency.prototype, "decimal_digits", void 0);
__decorate([
    (0, utils_1.MikroOrmBigNumberProperty)({ default: 0 }),
    __metadata("design:type", Object)
], Currency.prototype, "rounding", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb" }),
    __metadata("design:type", Object)
], Currency.prototype, "raw_rounding", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Currency.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], Currency.prototype, "updated_at", void 0);
Currency = __decorate([
    (0, core_1.Entity)({ tableName: "currency" })
], Currency);
exports.default = Currency;
