import { CreateServiceZoneDTO } from "@medusajs/types";
type StepInput = CreateServiceZoneDTO[];
export declare const createServiceZonesStepId = "create-service-zones";
export declare const createServiceZonesStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").ServiceZoneDTO[]>;
export {};
