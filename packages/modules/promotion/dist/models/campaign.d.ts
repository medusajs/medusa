import { DAL } from "@medusajs/types";
import { Collection, OptionalProps } from "@mikro-orm/core";
import CampaignBudget from "./campaign-budget";
import Promotion from "./promotion";
type OptionalRelations = "budget";
type OptionalFields = "description" | "currency" | "starts_at" | "ends_at" | DAL.SoftDeletableEntityDateColumns;
export default class Campaign {
    [OptionalProps]?: OptionalFields | OptionalRelations;
    id: string;
    name: string;
    description: string | null;
    currency: string | null;
    campaign_identifier: string;
    starts_at: Date | null;
    ends_at: Date | null;
    budget: CampaignBudget | null;
    promotions: Collection<Promotion, object>;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
//# sourceMappingURL=campaign.d.ts.map