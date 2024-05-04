import { UserDTO } from "@medusajs/types";
import { UserWorkflow } from "@medusajs/types";
export declare const createUsersWorkflowId = "create-users-workflow";
export declare const createUsersWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<UserWorkflow.CreateUsersWorkflowInputDTO, UserDTO[], Record<string, Function>>;
