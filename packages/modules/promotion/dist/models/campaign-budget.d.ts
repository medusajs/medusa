import { BigNumberRawValue, CampaignBudgetTypeValues, DAL } from "@medusajs/types";
import { BigNumber } from "@medusajs/utils";
import { OptionalProps } from "@mikro-orm/core";
import Campaign from "./campaign";
type OptionalFields = "description" | "limit" | "used" | DAL.SoftDeletableEntityDateColumns;
export default class CampaignBudget {
    [OptionalProps]?: OptionalFields;
    id: string;
    type: CampaignBudgetTypeValues;
    campaign: Campaign | null;
    limit: BigNumber | number | null;
    raw_limit: BigNumberRawValue | null;
    used: BigNumber | number | null;
    raw_used: BigNumberRawValue | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
//# sourceMappingURL=campaign-budget.d.ts.map