/**
 * Utility factory and interfaces for module service public facing API
 */
import { Constructor, Context, FindConfig, Pluralize, RestoreReturn, SoftDeleteReturn } from "@medusajs/types";
import { MapToConfig } from "../common";
type ModelDTOConfig = {
    dto: object;
    create?: object;
    update?: object;
};
type ModelDTOConfigRecord = Record<any, ModelDTOConfig>;
type ModelNamingConfig = {
    singular?: string;
    plural?: string;
};
type ModelsConfigTemplate = {
    [ModelName: string]: ModelDTOConfig & ModelNamingConfig;
};
type ExtractSingularName<T extends Record<any, any>, K = keyof T> = T[K] extends {
    singular?: string;
} ? T[K]["singular"] : K;
type CreateMethodName<TModelDTOConfig extends ModelDTOConfigRecord, TModelName = keyof TModelDTOConfig> = TModelDTOConfig[TModelName] extends {
    create?: object;
} ? `create${ExtractPluralName<TModelDTOConfig, TModelName>}` : never;
type UpdateMethodName<TModelDTOConfig extends ModelDTOConfigRecord, TModelName = keyof TModelDTOConfig> = TModelDTOConfig[TModelName] extends {
    update?: object;
} ? `update${ExtractPluralName<TModelDTOConfig, TModelName>}` : never;
type ExtractPluralName<T extends Record<any, any>, K = keyof T> = T[K] extends {
    plural?: string;
} ? T[K]["plural"] : Pluralize<K & string>;
type ModelConfiguration = Constructor<any> | {
    singular?: string;
    plural?: string;
    model: Constructor<any>;
};
export interface AbstractModuleServiceBase<TContainer, TMainModelDTO> {
    get __container__(): TContainer;
    retrieve(id: string, config?: FindConfig<any>, sharedContext?: Context): Promise<TMainModelDTO>;
    list(filters?: any, config?: FindConfig<any>, sharedContext?: Context): Promise<TMainModelDTO[]>;
    listAndCount(filters?: any, config?: FindConfig<any>, sharedContext?: Context): Promise<[TMainModelDTO[], number]>;
    delete(primaryKeyValues: string | object | string[] | object[], sharedContext?: Context): Promise<void>;
    softDelete<TReturnableLinkableKeys extends string>(primaryKeyValues: string | object | string[] | object[], config?: SoftDeleteReturn<TReturnableLinkableKeys>, sharedContext?: Context): Promise<Record<string, string[]> | void>;
    restore<TReturnableLinkableKeys extends string>(primaryKeyValues: string | object | string[] | object[], config?: RestoreReturn<TReturnableLinkableKeys>, sharedContext?: Context): Promise<Record<string, string[]> | void>;
}
export type AbstractModuleService<TContainer, TMainModelDTO, TModelDTOConfig extends ModelsConfigTemplate> = AbstractModuleServiceBase<TContainer, TMainModelDTO> & {
    [TModelName in keyof TModelDTOConfig as `retrieve${ExtractSingularName<TModelDTOConfig, TModelName> & string}`]: (id: string, config?: FindConfig<any>, sharedContext?: Context) => Promise<TModelDTOConfig[TModelName & string]["dto"]>;
} & {
    [TModelName in keyof TModelDTOConfig as `list${ExtractPluralName<TModelDTOConfig, TModelName> & string}`]: (filters?: any, config?: FindConfig<any>, sharedContext?: Context) => Promise<TModelDTOConfig[TModelName & string]["dto"][]>;
} & {
    [TModelName in keyof TModelDTOConfig as `listAndCount${ExtractPluralName<TModelDTOConfig, TModelName> & string}`]: {
        (filters?: any, config?: FindConfig<any>, sharedContext?: Context): Promise<[
            TModelDTOConfig[TModelName & string]["dto"][],
            number
        ]>;
    };
} & {
    [TModelName in keyof TModelDTOConfig as `delete${ExtractPluralName<TModelDTOConfig, TModelName> & string}`]: {
        (primaryKeyValues: string | object | string[] | object[], sharedContext?: Context): Promise<void>;
    };
} & {
    [TModelName in keyof TModelDTOConfig as `softDelete${ExtractPluralName<TModelDTOConfig, TModelName> & string}`]: {
        <TReturnableLinkableKeys extends string>(primaryKeyValues: string | object | string[] | object[], config?: SoftDeleteReturn<TReturnableLinkableKeys>, sharedContext?: Context): Promise<Record<string, string[]> | void>;
    };
} & {
    [TModelName in keyof TModelDTOConfig as `restore${ExtractPluralName<TModelDTOConfig, TModelName> & string}`]: {
        <TReturnableLinkableKeys extends string>(primaryKeyValues: string | object | string[] | object[], config?: RestoreReturn<TReturnableLinkableKeys>, sharedContext?: Context): Promise<Record<string, string[]> | void>;
    };
} & {
    [TModelName in keyof TModelDTOConfig as CreateMethodName<TModelDTOConfig, TModelName>]: {
        (data: TModelDTOConfig[TModelName]["create"][], sharedContext?: Context): Promise<TModelDTOConfig[TModelName]["dto"][]>;
    };
} & {
    [TModelName in keyof TModelDTOConfig as CreateMethodName<TModelDTOConfig, TModelName>]: {
        (data: TModelDTOConfig[TModelName]["create"], sharedContext?: Context): Promise<TModelDTOConfig[TModelName]["dto"]>;
    };
} & {
    [TModelName in keyof TModelDTOConfig as UpdateMethodName<TModelDTOConfig, TModelName>]: {
        (data: TModelDTOConfig[TModelName]["update"][], sharedContext?: Context): Promise<TModelDTOConfig[TModelName]["dto"][]>;
    };
} & {
    [TModelName in keyof TModelDTOConfig as UpdateMethodName<TModelDTOConfig, TModelName>]: {
        (data: TModelDTOConfig[TModelName]["update"], sharedContext?: Context): Promise<TModelDTOConfig[TModelName]["dto"]>;
    };
};
/**
 * Factory function for creating an abstract module service
 *
 * @example
 *
 * const otherModels = new Set([
 *   Currency,
 *   Price,
 *   PriceList,
 *   PriceListRule,
 *   PriceListRuleValue,
 *   PriceRule,
 *   PriceSetRuleType,
 *   RuleType,
 * ])
 *
 * const AbstractModuleService = ModulesSdkUtils.abstractModuleServiceFactory<
 *   InjectedDependencies,
 *   PricingTypes.PriceSetDTO,
 *   // The configuration of each entity also accept singular/plural properties, if not provided then it is using english pluralization
 *   {
 *     Currency: { dto: PricingTypes.CurrencyDTO }
 *     Price: { dto: PricingTypes.PriceDTO }
 *     PriceRule: { dto: PricingTypes.PriceRuleDTO }
 *     RuleType: { dto: PricingTypes.RuleTypeDTO }
 *     PriceList: { dto: PricingTypes.PriceListDTO }
 *     PriceListRule: { dto: PricingTypes.PriceListRuleDTO }
 *   }
 * >(PriceSet, [...otherModels], entityNameToLinkableKeysMap)
 *
 * @param mainModel
 * @param otherModels
 * @param entityNameToLinkableKeysMap
 */
export declare function abstractModuleServiceFactory<TContainer, TMainModelDTO, ModelsConfig extends ModelsConfigTemplate>(mainModel: Constructor<any>, otherModels: ModelConfiguration[], entityNameToLinkableKeysMap?: MapToConfig): {
    new (container: TContainer): AbstractModuleService<TContainer, TMainModelDTO, ModelsConfig>;
};
export {};
