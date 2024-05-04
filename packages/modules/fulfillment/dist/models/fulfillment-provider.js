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
let FulfillmentProvider = class FulfillmentProvider {
    constructor() {
        this.is_enabled = true;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "serpro");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "serpro");
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], FulfillmentProvider.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "boolean", defaultRaw: "true" }),
    __metadata("design:type", Boolean)
], FulfillmentProvider.prototype, "is_enabled", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FulfillmentProvider.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FulfillmentProvider.prototype, "onInit", null);
FulfillmentProvider = __decorate([
    (0, core_1.Entity)()
], FulfillmentProvider);
exports.default = FulfillmentProvider;
