type WorkflowInput = {
    ids: string[];
};
export declare const deleteReservationsWorkflowId = "delete-reservations";
export declare const deleteReservationsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, void, Record<string, Function>>;
export {};
