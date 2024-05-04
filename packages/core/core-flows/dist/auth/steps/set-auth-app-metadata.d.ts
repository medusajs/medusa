type StepInput = {
    authUserId: string;
    key: string;
    value: string;
};
export declare const setAuthAppMetadataStepId = "set-auth-app-metadata";
export declare const setAuthAppMetadataStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").AuthUserDTO>;
export {};
