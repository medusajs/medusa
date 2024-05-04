"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestratorBuilder = void 0;
class OrchestratorBuilder {
    get hasChanges() {
        return this.hasChanges_;
    }
    constructor(steps) {
        this.hasChanges_ = false;
        this.load(steps);
    }
    load(steps) {
        this.steps = {
            depth: -1,
            parent: null,
            next: steps
                ? JSON.parse(JSON.stringify((steps.action ? steps : steps.next)))
                : undefined,
        };
        this.updateDepths(this.steps, {}, 1, -1);
        return this;
    }
    addAction(action, options = {}) {
        const step = this.findLastStep();
        const newAction = {
            action,
            depth: step.depth + 1,
            parent: step.action,
            ...options,
        };
        step.next = newAction;
        this.hasChanges_ = true;
        return this;
    }
    replaceAction(existingAction, action, options = {}) {
        const step = this.findOrThrowStepByAction(existingAction);
        step.action = action;
        Object.assign(step, options);
        this.hasChanges_ = true;
        return this;
    }
    insertActionBefore(existingAction, action, options = {}) {
        const parentStep = this.findParentStepByAction(existingAction);
        if (parentStep) {
            const oldNext = parentStep.next;
            const newDepth = parentStep.depth + 1;
            if (Array.isArray(parentStep.next)) {
                const index = parentStep.next.findIndex((step) => step.action === existingAction);
                if (index > -1) {
                    parentStep.next[index] = {
                        action,
                        ...options,
                        next: oldNext[index],
                        depth: newDepth,
                    };
                }
            }
            else {
                parentStep.next = {
                    action,
                    ...options,
                    next: oldNext,
                    depth: newDepth,
                };
            }
            this.updateDepths(oldNext, parentStep);
        }
        this.hasChanges_ = true;
        return this;
    }
    insertActionAfter(existingAction, action, options = {}) {
        const step = this.findOrThrowStepByAction(existingAction);
        const oldNext = step.next;
        const newDepth = step.depth + 1;
        step.next = {
            action,
            ...options,
            next: oldNext,
            depth: newDepth,
            parent: step.action,
        };
        this.updateDepths(oldNext, step.next);
        this.hasChanges_ = true;
        return this;
    }
    appendTo(step, newStep) {
        if (typeof step === "string") {
            step = this.findOrThrowStepByAction(step);
        }
        step.next = {
            ...newStep,
            depth: step.depth + 1,
            parent: step.action,
        };
        this.hasChanges_ = true;
        return this;
    }
    appendAction(action, to, options = {}) {
        const newAction = {
            action,
            ...options,
        };
        const branch = this.findLastStep(this.findStepByAction(to));
        this.appendTo(branch, newAction);
        return this;
    }
    move(actionToMove, targetAction, { runInParallel, mergeNext, } = {
        runInParallel: false,
        mergeNext: false,
    }) {
        const parentActionToMoveStep = this.findParentStepByAction(actionToMove);
        const parentTargetActionStep = this.findParentStepByAction(targetAction);
        const actionToMoveStep = this.findStepByAction(actionToMove, parentTargetActionStep);
        if (!actionToMoveStep) {
            throw new Error(`Action "${actionToMove}" could not be found in the following steps of "${targetAction}"`);
        }
        if (Array.isArray(parentActionToMoveStep.next)) {
            const index = parentActionToMoveStep.next.findIndex((step) => step.action === actionToMove);
            if (index > -1) {
                parentActionToMoveStep.next.splice(index, 1);
            }
        }
        else {
            delete parentActionToMoveStep.next;
        }
        if (runInParallel) {
            if (Array.isArray(parentTargetActionStep.next)) {
                parentTargetActionStep.next.push(actionToMoveStep);
            }
            else if (parentTargetActionStep.next) {
                parentTargetActionStep.next = [
                    parentTargetActionStep.next,
                    actionToMoveStep,
                ];
            }
        }
        else {
            if (actionToMoveStep.next) {
                if (mergeNext) {
                    if (Array.isArray(actionToMoveStep.next)) {
                        actionToMoveStep.next.push(parentTargetActionStep.next);
                    }
                    else {
                        actionToMoveStep.next = [
                            actionToMoveStep.next,
                            parentTargetActionStep.next,
                        ];
                    }
                }
                else {
                    this.appendTo(this.findLastStep(actionToMoveStep), parentTargetActionStep.next);
                }
            }
            else {
                actionToMoveStep.next = parentTargetActionStep.next;
            }
            parentTargetActionStep.next = actionToMoveStep;
        }
        this.updateDepths(actionToMoveStep, parentTargetActionStep, 1, parentTargetActionStep.depth);
        this.hasChanges_ = true;
        return this;
    }
    moveAction(actionToMove, targetAction) {
        return this.move(actionToMove, targetAction);
    }
    moveAndMergeNextAction(actionToMove, targetAction) {
        return this.move(actionToMove, targetAction, { mergeNext: true });
    }
    mergeActions(where, ...actions) {
        actions.unshift(where);
        if (actions.length < 2) {
            throw new Error("Cannot merge less than two actions");
        }
        for (const action of actions) {
            if (action !== where) {
                this.move(action, where, { runInParallel: true });
            }
        }
        return this;
    }
    deleteAction(action, steps = this.steps) {
        const actionStep = this.findOrThrowStepByAction(action);
        const parentStep = this.findParentStepByAction(action, steps);
        if (Array.isArray(parentStep.next)) {
            const index = parentStep.next.findIndex((step) => step.action === action);
            if (index > -1 && actionStep.next) {
                if (actionStep.next) {
                    parentStep.next[index] = actionStep.next;
                }
                else {
                    parentStep.next.splice(index, 1);
                }
            }
        }
        else {
            parentStep.next = actionStep.next;
        }
        this.updateDepths(actionStep.next, parentStep, 1, parentStep.depth);
        this.hasChanges_ = true;
        return this;
    }
    pruneAction(action) {
        const actionStep = this.findOrThrowStepByAction(action);
        const parentStep = this.findParentStepByAction(action, this.steps);
        if (Array.isArray(parentStep.next)) {
            const index = parentStep.next.findIndex((step) => step.action === action);
            if (index > -1) {
                parentStep.next.splice(index, 1);
            }
        }
        else {
            delete parentStep.next;
        }
        this.hasChanges_ = true;
        return this;
    }
    findStepByAction(action, step = this.steps) {
        if (step.uuid === action || step.action === action) {
            return step;
        }
        if (Array.isArray(step.next)) {
            for (const subStep of step.next) {
                const found = this.findStepByAction(action, subStep);
                if (found) {
                    return found;
                }
            }
        }
        else if (step.next && typeof step.next === "object") {
            return this.findStepByAction(action, step.next);
        }
        return;
    }
    findOrThrowStepByAction(action, steps = this.steps) {
        const step = this.findStepByAction(action, steps);
        if (!step) {
            throw new Error(`Action "${action}" could not be found`);
        }
        return step;
    }
    findParentStepByAction(action, step = this.steps) {
        if (!step.next) {
            return;
        }
        const nextSteps = Array.isArray(step.next) ? step.next : [step.next];
        for (const nextStep of nextSteps) {
            if (!nextStep) {
                continue;
            }
            if (nextStep.uuid === action || nextStep.action === action) {
                return step;
            }
            const foundStep = this.findParentStepByAction(action, nextStep);
            if (foundStep) {
                return foundStep;
            }
        }
        return;
    }
    findLastStep(steps = this.steps) {
        let step = steps;
        while (step.next) {
            step = Array.isArray(step.next)
                ? step.next[step.next.length - 1]
                : step.next;
        }
        return step;
    }
    updateDepths(startingStep, parent, incr = 1, beginFrom) {
        if (!startingStep) {
            return;
        }
        const update = (step, parent, beginFrom) => {
            step.depth = beginFrom + incr;
            step.parent = parent.action;
            if (Array.isArray(step.next)) {
                step.next.forEach((nextAction) => update(nextAction, step, step.depth));
            }
            else if (step.next) {
                update(step.next, step, step.depth);
            }
        };
        update(startingStep, parent, beginFrom ?? startingStep.depth);
    }
    build() {
        if (!this.steps.next) {
            return {};
        }
        const ignore = ["depth", "parent"];
        const result = JSON.parse(JSON.stringify(Array.isArray(this.steps.next) ? this.steps : this.steps.next, null), (key, value) => {
            if (ignore.includes(key)) {
                return;
            }
            return value;
        });
        this.hasChanges_ = false;
        return result;
    }
}
exports.OrchestratorBuilder = OrchestratorBuilder;
//# sourceMappingURL=orchestrator-builder.js.map