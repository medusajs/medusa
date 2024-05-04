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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowsModuleService = void 0;
const utils_1 = require("@medusajs/utils");
const joiner_config_1 = require("../joiner-config");
class WorkflowsModuleService {
    constructor({ baseRepository, workflowExecutionService, workflowOrchestratorService, }, moduleDeclaration) {
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.workflowExecutionService_ = workflowExecutionService;
        this.workflowOrchestratorService_ = workflowOrchestratorService;
    }
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    async retrieveWorkflowExecution(idOrObject, config = {}, sharedContext = {}) {
        const objValue = (0, utils_1.isString)(idOrObject)
            ? { id: idOrObject }
            : {
                workflow_id: idOrObject.workflow_id,
                transaction_id: idOrObject.transaction_id,
            };
        const wfExecution = await this.workflowExecutionService_.list(objValue, config, sharedContext);
        if (wfExecution.length === 0) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `WorkflowExecution with ${Object.keys(objValue).join(", ")}: ${Object.values(objValue).join(", ")} was not found`);
        }
        // eslint-disable-next-line max-len
        return await this.baseRepository_.serialize(wfExecution[0], {
            populate: true,
        });
    }
    async listWorkflowExecution(filters = {}, config = {}, sharedContext = {}) {
        if (filters.transaction_id) {
            if (Array.isArray(filters.transaction_id)) {
                filters.transaction_id = {
                    $in: filters.transaction_id,
                };
            }
        }
        if (filters.workflow_id) {
            if (Array.isArray(filters.workflow_id)) {
                filters.workflow_id = {
                    $in: filters.workflow_id,
                };
            }
        }
        const wfExecutions = await this.workflowExecutionService_.list(filters, config, sharedContext);
        return await this.baseRepository_.serialize(wfExecutions, {
            populate: true,
        });
    }
    async listAndCountWorkflowExecution(filters = {}, config = {}, sharedContext = {}) {
        if (filters.transaction_id) {
            if (Array.isArray(filters.transaction_id)) {
                filters.transaction_id = {
                    $in: filters.transaction_id,
                };
            }
        }
        if (filters.workflow_id) {
            if (Array.isArray(filters.workflow_id)) {
                filters.workflow_id = {
                    $in: filters.workflow_id,
                };
            }
        }
        const [wfExecutions, count] = await this.workflowExecutionService_.listAndCount(filters, config, sharedContext);
        return [
            await this.baseRepository_.serialize(wfExecutions, {
                populate: true,
            }),
            count,
        ];
    }
    async run(workflowIdOrWorkflow, options = {}, context = {}) {
        const ret = await this.workflowOrchestratorService_.run(workflowIdOrWorkflow, options, context);
        return ret;
    }
    async getRunningTransaction(workflowId, transactionId, context = {}) {
        return await this.workflowOrchestratorService_.getRunningTransaction(workflowId, transactionId, context);
    }
    async setStepSuccess({ idempotencyKey, stepResponse, options, }, context = {}) {
        return await this.workflowOrchestratorService_.setStepSuccess({
            idempotencyKey,
            stepResponse,
            options,
        }, context);
    }
    async setStepFailure({ idempotencyKey, stepResponse, options, }, context = {}) {
        return await this.workflowOrchestratorService_.setStepFailure({
            idempotencyKey,
            stepResponse,
            options,
        }, context);
    }
    async subscribe(args, context = {}) {
        return this.workflowOrchestratorService_.subscribe(args, context);
    }
    async unsubscribe(args, context = {}) {
        return this.workflowOrchestratorService_.unsubscribe(args, context);
    }
}
exports.WorkflowsModuleService = WorkflowsModuleService;
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowsModuleService.prototype, "retrieveWorkflowExecution", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowsModuleService.prototype, "listWorkflowExecution", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowsModuleService.prototype, "listAndCountWorkflowExecution", null);
__decorate([
    (0, utils_1.InjectSharedContext)(),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof TWorkflow !== "undefined" && TWorkflow) === "function" ? _a : Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowsModuleService.prototype, "run", null);
__decorate([
    (0, utils_1.InjectSharedContext)(),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WorkflowsModuleService.prototype, "getRunningTransaction", null);
__decorate([
    (0, utils_1.InjectSharedContext)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowsModuleService.prototype, "setStepSuccess", null);
__decorate([
    (0, utils_1.InjectSharedContext)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowsModuleService.prototype, "setStepFailure", null);
__decorate([
    (0, utils_1.InjectSharedContext)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowsModuleService.prototype, "subscribe", null);
__decorate([
    (0, utils_1.InjectSharedContext)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowsModuleService.prototype, "unsubscribe", null);
