import { ShippingOptionDTO } from "./shipping-option";
import { BaseFilterable, OperatorMap } from "../../dal";
/**
 * The shipping option type details.
 */
export interface ShippingOptionTypeDTO {
    /**
     * The ID of the shipping option type.
     */
    id: string;
    /**
     * The label of the shipping option type.
     */
    label: string;
    /**
     * The description of the shipping option type.
     */
    description: string;
    /**
     * The code of the shipping option type.
     */
    code: string;
    /**
     * The associated shipping option's ID.
     */
    shipping_option_id: string;
    /**
     * The associated shipping option.
     */
    shipping_option: ShippingOptionDTO;
    /**
     * The creation date of the shipping option type.
     */
    created_at: Date;
    /**
     * The update date of the shipping option type.
     */
    updated_at: Date;
    /**
     * The deletion date of the shipping option type.
     */
    deleted_at: Date | null;
}
/**
 * The filters to apply on the retrieved shipping option types.
 */
export interface FilterableShippingOptionTypeProps extends BaseFilterable<FilterableShippingOptionTypeProps> {
    /**
     * The IDs to filter the shipping option types by.
     */
    id?: string | string[] | OperatorMap<string | string[]>;
    /**
     * Filter the shipping option types by their label.
     */
    label?: string | string[] | OperatorMap<string | string[]>;
    /**
     * Filter the shipping option types by their description.
     */
    description?: string | string[] | OperatorMap<string | string[]>;
    /**
     * Filter the shipping option types by their code.
     */
    code?: string | string[] | OperatorMap<string | string[]>;
}
//# sourceMappingURL=shipping-option-type.d.ts.map