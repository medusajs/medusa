"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalWorkflow = void 0;
const utils_1 = require("@medusajs/utils");
const awilix_1 = require("awilix");
const workflow_manager_1 = require("./workflow-manager");
class GlobalWorkflow extends workflow_manager_1.WorkflowManager {
    constructor(modulesLoaded, context, subscribe) {
        super();
        let container;
        if (!Array.isArray(modulesLoaded) && modulesLoaded) {
            if (!("cradle" in modulesLoaded)) {
                container = (0, utils_1.createMedusaContainer)(modulesLoaded);
            }
            else {
                container = modulesLoaded;
            }
        }
        else if (Array.isArray(modulesLoaded) && modulesLoaded.length) {
            container = (0, utils_1.createMedusaContainer)();
            for (const mod of modulesLoaded) {
                const registrationName = mod.__definition.registrationName;
                container.register(registrationName, (0, awilix_1.asValue)(mod));
            }
        }
        this.container = container;
        this.context = context ?? {};
        this.subscribe = subscribe ?? {};
    }
    async run(workflowId, uniqueTransactionId, input) {
        if (!workflow_manager_1.WorkflowManager.workflows.has(workflowId)) {
            throw new Error(`Workflow with id "${workflowId}" not found.`);
        }
        const workflow = workflow_manager_1.WorkflowManager.workflows.get(workflowId);
        const orchestrator = workflow.orchestrator;
        const transaction = await orchestrator.beginTransaction(uniqueTransactionId, workflow.handler(this.container, this.context), input);
        if (this.subscribe.onStepBegin) {
            transaction.once("stepBegin", this.subscribe.onStepBegin);
        }
        if (this.subscribe.onStepSuccess) {
            transaction.once("stepSuccess", this.subscribe.onStepSuccess);
        }
        if (this.subscribe.onStepFailure) {
            transaction.once("stepFailure", this.subscribe.onStepFailure);
        }
        if (this.subscribe.onStepAwaiting) {
            transaction.once("stepAwaiting", this.subscribe.onStepAwaiting);
        }
        await orchestrator.resume(transaction);
        return transaction;
    }
    async registerStepSuccess(workflowId, idempotencyKey, response) {
        if (!workflow_manager_1.WorkflowManager.workflows.has(workflowId)) {
            throw new Error(`Workflow with id "${workflowId}" not found.`);
        }
        const workflow = workflow_manager_1.WorkflowManager.workflows.get(workflowId);
        const orchestrator = workflow.orchestrator;
        orchestrator.once("resume", (transaction) => {
            if (this.subscribe.onStepBegin) {
                transaction.once("stepBegin", this.subscribe.onStepBegin);
            }
            if (this.subscribe.onStepSuccess) {
                transaction.once("stepSuccess", this.subscribe.onStepSuccess);
            }
            if (this.subscribe.onStepFailure) {
                transaction.once("stepFailure", this.subscribe.onStepFailure);
            }
        });
        return await workflow.orchestrator.registerStepSuccess(idempotencyKey, workflow.handler(this.container, this.context), undefined, response);
    }
    async registerStepFailure(workflowId, idempotencyKey, error) {
        if (!workflow_manager_1.WorkflowManager.workflows.has(workflowId)) {
            throw new Error(`Workflow with id "${workflowId}" not found.`);
        }
        const workflow = workflow_manager_1.WorkflowManager.workflows.get(workflowId);
        const orchestrator = workflow.orchestrator;
        orchestrator.once("resume", (transaction) => {
            if (this.subscribe.onStepBegin) {
                transaction.once("stepBegin", this.subscribe.onStepBegin);
            }
            if (this.subscribe.onStepSuccess) {
                transaction.once("stepSuccess", this.subscribe.onStepSuccess);
            }
            if (this.subscribe.onStepFailure) {
                transaction.once("stepFailure", this.subscribe.onStepFailure);
            }
        });
        return await workflow.orchestrator.registerStepFailure(idempotencyKey, error, workflow.handler(this.container, this.context));
    }
}
exports.GlobalWorkflow = GlobalWorkflow;
GlobalWorkflow.workflows = new Map();
//# sourceMappingURL=global-workflow.js.map