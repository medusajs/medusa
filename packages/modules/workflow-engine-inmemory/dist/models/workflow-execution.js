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
const orchestration_1 = require("@medusajs/orchestration");
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
let WorkflowExecution = class WorkflowExecution {
    constructor() {
        this.execution = null;
        this.context = null;
        this.deleted_at = null;
    }
    onCreate() {
        this.id = (0, utils_1.generateEntityId)(this.id, "wf_exec");
    }
    onInit() {
        this.id = (0, utils_1.generateEntityId)(this.id, "wf_exec");
    }
};
__decorate([
    (0, core_1.Property)({ columnType: "text", nullable: false }),
    (0, core_1.Index)({ name: "IDX_workflow_execution_id" }),
    __metadata("design:type", String)
], WorkflowExecution.prototype, "id", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_workflow_execution_workflow_id" }),
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], WorkflowExecution.prototype, "workflow_id", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_workflow_execution_transaction_id" }),
    (0, core_1.PrimaryKey)({ columnType: "text" }),
    __metadata("design:type", String)
], WorkflowExecution.prototype, "transaction_id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], WorkflowExecution.prototype, "execution", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], WorkflowExecution.prototype, "context", void 0);
__decorate([
    (0, core_1.Index)({ name: "IDX_workflow_execution_state" }),
    (0, core_1.Enum)(() => orchestration_1.TransactionState),
    __metadata("design:type", String)
], WorkflowExecution.prototype, "state", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], WorkflowExecution.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        columnType: "timestamptz",
        defaultRaw: "now()",
    }),
    __metadata("design:type", Date)
], WorkflowExecution.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], WorkflowExecution.prototype, "deleted_at", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkflowExecution.prototype, "onCreate", null);
__decorate([
    (0, core_1.OnInit)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkflowExecution.prototype, "onInit", null);
WorkflowExecution = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Unique)({
        name: "IDX_workflow_execution_workflow_id_transaction_id_unique",
        properties: ["workflow_id", "transaction_id"],
    }),
    (0, core_1.Filter)(utils_1.DALUtils.mikroOrmSoftDeletableFilterOptions)
], WorkflowExecution);
exports.default = WorkflowExecution;
