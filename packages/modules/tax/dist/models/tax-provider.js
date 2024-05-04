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
const core_1 = require("@mikro-orm/core");
const TABLE_NAME = "tax_provider";
let TaxProvider = class TaxProvider {
    constructor() {
        this.is_enabled = true;
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], TaxProvider.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({
        default: true,
        columnType: "boolean",
    }),
    __metadata("design:type", Boolean)
], TaxProvider.prototype, "is_enabled", void 0);
TaxProvider = __decorate([
    (0, core_1.Entity)({ tableName: TABLE_NAME })
], TaxProvider);
exports.default = TaxProvider;
