import { BigNumberRawValue, DAL } from "@medusajs/types";
import { BigNumber } from "@medusajs/utils";
import { OptionalProps } from "@mikro-orm/core";
type OptionalAdjustmentLineProps = DAL.EntityDateColumns;
/**
 * As per the Mikro ORM docs, superclasses should use the abstract class definition
 * Source: https://mikro-orm.io/docs/inheritance-mapping
 */
export default abstract class AdjustmentLine {
    [OptionalProps]: OptionalAdjustmentLineProps;
    id: string;
    description: string | null;
    promotion_id: string | null;
    code: string | null;
    amount: BigNumber | number;
    raw_amount: BigNumberRawValue;
    provider_id: string | null;
    created_at: Date;
    updated_at: Date;
}
export {};
