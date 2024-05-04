import { LocalWorkflow } from "@medusajs/orchestration";
import { LoadedModule, MedusaContainer } from "@medusajs/types";
import { ExportedWorkflow } from "./helper";
export declare class MedusaWorkflow {
    static workflows: Record<string, (container?: LoadedModule[] | MedusaContainer) => Omit<LocalWorkflow, "run" | "registerStepSuccess" | "registerStepFailure" | "cancel"> & ExportedWorkflow>;
    static registerWorkflow(workflowId: any, exportedWorkflow: any): void;
    static getWorkflow(workflowId: any): (container?: MedusaContainer | {
        __joinerConfig: import("@medusajs/types").ModuleJoinerConfig;
        __definition: import("@medusajs/types").ModuleDefinition;
    }[] | undefined) => Omit<LocalWorkflow, "run" | "registerStepSuccess" | "registerStepFailure" | "cancel"> & ExportedWorkflow;
}
