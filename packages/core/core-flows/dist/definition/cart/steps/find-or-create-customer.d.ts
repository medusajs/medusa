import { CustomerDTO } from "@medusajs/types";
interface StepInput {
    customerId?: string | null;
    email?: string | null;
}
interface StepOutput {
    customer?: CustomerDTO | null;
    email?: string | null;
}
export declare const findOrCreateCustomerStepId = "find-or-create-customer";
export declare const findOrCreateCustomerStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, StepOutput>;
export {};
