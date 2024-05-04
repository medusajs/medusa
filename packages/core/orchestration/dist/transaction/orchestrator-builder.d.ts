import { TransactionStepsDefinition } from "./types";
interface InternalStep extends TransactionStepsDefinition {
    next?: InternalStep | InternalStep[];
    depth: number;
    parent?: InternalStep | null;
}
export declare class OrchestratorBuilder {
    protected steps: InternalStep;
    protected hasChanges_: boolean;
    get hasChanges(): boolean;
    constructor(steps?: TransactionStepsDefinition);
    load(steps?: TransactionStepsDefinition): this;
    addAction(action: string, options?: Partial<TransactionStepsDefinition>): this;
    replaceAction(existingAction: string, action: string, options?: Partial<TransactionStepsDefinition>): this;
    insertActionBefore(existingAction: string, action: string, options?: Partial<TransactionStepsDefinition>): this;
    insertActionAfter(existingAction: string, action: string, options?: Partial<TransactionStepsDefinition>): this;
    protected appendTo(step: InternalStep | string, newStep: InternalStep): this;
    appendAction(action: string, to: string, options?: Partial<TransactionStepsDefinition>): this;
    protected move(actionToMove: string, targetAction: string, { runInParallel, mergeNext, }?: {
        runInParallel?: boolean;
        mergeNext?: boolean;
    }): OrchestratorBuilder;
    moveAction(actionToMove: string, targetAction: string): OrchestratorBuilder;
    moveAndMergeNextAction(actionToMove: string, targetAction: string): OrchestratorBuilder;
    mergeActions(where: string, ...actions: string[]): this;
    deleteAction(action: string, steps?: InternalStep): this;
    pruneAction(action: string): this;
    protected findStepByAction(action: string, step?: InternalStep): InternalStep | undefined;
    protected findOrThrowStepByAction(action: string, steps?: InternalStep): InternalStep;
    protected findParentStepByAction(action: string, step?: InternalStep): InternalStep | undefined;
    protected findLastStep(steps?: InternalStep): InternalStep;
    protected updateDepths(startingStep: InternalStep, parent: any, incr?: number, beginFrom?: number): void;
    build(): TransactionStepsDefinition;
}
export {};
