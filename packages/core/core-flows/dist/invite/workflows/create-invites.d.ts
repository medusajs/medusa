import { InviteDTO, InviteWorkflow } from "@medusajs/types";
export declare const createInvitesWorkflowId = "create-invite-step";
export declare const createInvitesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<InviteWorkflow.CreateInvitesWorkflowInputDTO, InviteDTO[], Record<string, Function>>;
