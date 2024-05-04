interface StepInput {
    entry_point: string;
    fields: string[];
    variables?: Record<string, any>;
    throw_if_key_not_found?: boolean;
    throw_if_relation_not_found?: boolean | string[];
    list?: boolean;
}
export declare const useRemoteQueryStepId = "use-remote-query";
export declare const useRemoteQueryStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, any>;
export {};
