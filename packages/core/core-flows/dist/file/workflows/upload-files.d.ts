import { FileDTO } from "@medusajs/types";
type WorkflowInput = {
    files: {
        filename: string;
        mimeType: string;
        content: string;
    }[];
};
export declare const uploadFilesWorkflowId = "upload-files";
export declare const uploadFilesWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, FileDTO[], Record<string, Function>>;
export {};
