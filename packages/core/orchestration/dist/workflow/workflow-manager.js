"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowManager = void 0;
const transaction_1 = require("../transaction");
class WorkflowManager {
    static unregister(workflowId) {
        WorkflowManager.workflows.delete(workflowId);
    }
    static unregisterAll() {
        WorkflowManager.workflows.clear();
    }
    static getWorkflows() {
        return WorkflowManager.workflows;
    }
    static getWorkflow(workflowId) {
        return WorkflowManager.workflows.get(workflowId);
    }
    static getTransactionDefinition(workflowId) {
        if (!WorkflowManager.workflows.has(workflowId)) {
            throw new Error(`Workflow with id "${workflowId}" not found.`);
        }
        const workflow = WorkflowManager.workflows.get(workflowId);
        return new transaction_1.OrchestratorBuilder(workflow.flow_);
    }
    static register(workflowId, flow, handlers, options = {}, requiredModules, optionalModules) {
        const finalFlow = flow instanceof transaction_1.OrchestratorBuilder ? flow.build() : flow;
        if (WorkflowManager.workflows.has(workflowId)) {
            const excludeStepUuid = (key, value) => {
                return key === "uuid" ? undefined : value;
            };
            const areStepsEqual = finalFlow
                ? JSON.stringify(finalFlow, excludeStepUuid) ===
                    JSON.stringify(WorkflowManager.workflows.get(workflowId).flow_, excludeStepUuid)
                : true;
            if (!areStepsEqual) {
                if (process.env.MEDUSA_FF_MEDUSA_V2 == "true") {
                    throw new Error(`Workflow with id "${workflowId}" and step definition already exists.`);
                }
            }
        }
        WorkflowManager.workflows.set(workflowId, {
            id: workflowId,
            flow_: finalFlow,
            orchestrator: new transaction_1.TransactionOrchestrator(workflowId, finalFlow ?? {}, options),
            handler: WorkflowManager.buildHandlers(handlers),
            handlers_: handlers,
            options,
            requiredModules,
            optionalModules,
        });
    }
    static update(workflowId, flow, handlers, options = {}, requiredModules, optionalModules) {
        if (!WorkflowManager.workflows.has(workflowId)) {
            throw new Error(`Workflow with id "${workflowId}" not found.`);
        }
        const workflow = WorkflowManager.workflows.get(workflowId);
        for (const [key, value] of handlers.entries()) {
            workflow.handlers_.set(key, value);
        }
        const finalFlow = flow instanceof transaction_1.OrchestratorBuilder ? flow.build() : flow;
        const updatedOptions = { ...workflow.options, ...options };
        WorkflowManager.workflows.set(workflowId, {
            id: workflowId,
            flow_: finalFlow,
            orchestrator: new transaction_1.TransactionOrchestrator(workflowId, finalFlow, updatedOptions),
            handler: WorkflowManager.buildHandlers(workflow.handlers_),
            handlers_: workflow.handlers_,
            options: updatedOptions,
            requiredModules,
            optionalModules,
        });
    }
    static buildHandlers(handlers) {
        return (container, context) => {
            return async (actionId, handlerType, payload, transaction, step, orchestrator) => {
                const command = handlers.get(actionId);
                if (!command) {
                    throw new Error(`Handler for action "${actionId}" not found.`);
                }
                else if (!command[handlerType]) {
                    throw new Error(`"${handlerType}" handler for action "${actionId}" not found.`);
                }
                const { invoke, compensate, payload: input } = payload.context;
                const { metadata } = payload;
                return await command[handlerType]({
                    container,
                    payload: input,
                    invoke,
                    compensate,
                    metadata,
                    transaction: transaction,
                    step,
                    orchestrator,
                    context,
                });
            };
        };
    }
}
exports.WorkflowManager = WorkflowManager;
WorkflowManager.workflows = new Map();
global.WorkflowManager ?? (global.WorkflowManager = WorkflowManager);
exports.WorkflowManager = global.WorkflowManager;
//# sourceMappingURL=workflow-manager.js.map