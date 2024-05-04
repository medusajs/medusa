import { DAL, PromotionTypeValues } from "@medusajs/types";
import { Collection, OptionalProps } from "@mikro-orm/core";
import ApplicationMethod from "./application-method";
import Campaign from "./campaign";
import PromotionRule from "./promotion-rule";
type OptionalFields = "is_automatic" | DAL.SoftDeletableEntityDateColumns;
type OptionalRelations = "application_method" | "campaign";
export default class Promotion {
    [OptionalProps]?: OptionalFields | OptionalRelations;
    id: string;
    code: string;
    campaign: Campaign | null;
    is_automatic: boolean;
    type: PromotionTypeValues;
    application_method: ApplicationMethod;
    rules: Collection<PromotionRule, object>;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
//# sourceMappingURL=promotion.d.ts.map