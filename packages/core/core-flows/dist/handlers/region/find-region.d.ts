import { RegionTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type RegionResultDTO = {
    region_id?: string;
    region?: RegionTypes.RegionDTO__legacy;
};
type HandlerInputData = {
    region: {
        region_id: string;
    };
};
declare enum Aliases {
    Region = "region"
}
export declare function findRegion({ container, data, }: WorkflowArguments<HandlerInputData>): Promise<RegionResultDTO>;
export declare namespace findRegion {
    var aliases: typeof Aliases;
}
export {};
