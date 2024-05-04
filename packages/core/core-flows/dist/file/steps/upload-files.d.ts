type UploadFilesStepInput = {
    files: {
        filename: string;
        mimeType: string;
        content: string;
    }[];
};
export declare const uploadFilesStepId = "upload-files";
export declare const uploadFilesStep: import("@medusajs/workflows-sdk").StepFunction<UploadFilesStepInput, import("@medusajs/types").FileDTO[]>;
export {};
