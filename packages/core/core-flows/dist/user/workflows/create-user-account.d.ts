import { CreateUserDTO, UserDTO } from "@medusajs/types";
type WorkflowInput = {
    authUserId: string;
    userData: CreateUserDTO;
};
export declare const createUserAccountWorkflowId = "create-user-account";
export declare const createUserAccountWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, UserDTO, Record<string, Function>>;
export {};
