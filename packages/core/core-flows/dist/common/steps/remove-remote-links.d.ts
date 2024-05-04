import { DeleteEntityInput } from "@medusajs/modules-sdk";
type RemoveRemoteLinksStepInput = DeleteEntityInput | DeleteEntityInput[];
export declare const removeRemoteLinkStepId = "remove-remote-links";
export declare const removeRemoteLinkStep: import("@medusajs/workflows-sdk").StepFunction<RemoveRemoteLinksStepInput, DeleteEntityInput>;
export {};
