import { InviteDTO, InviteWorkflow } from "@medusajs/types";
export declare const refreshInviteTokensWorkflowId = "refresh-invite-tokens-workflow";
export declare const refreshInviteTokensWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<InviteWorkflow.ResendInvitesWorkflowInputDTO, InviteDTO[], Record<string, Function>>;
