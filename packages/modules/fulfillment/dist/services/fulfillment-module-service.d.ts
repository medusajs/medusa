import { Context, DAL, FilterableFulfillmentSetProps, FindConfig, FulfillmentDTO, FulfillmentTypes, IFulfillmentModuleService, InternalModuleDeclaration, ModuleJoinerConfig, ModulesSdkTypes, ShippingOptionDTO, UpdateFulfillmentSetDTO } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { Fulfillment, FulfillmentSet, GeoZone, ServiceZone, ShippingOption, ShippingOptionRule, ShippingOptionType, ShippingProfile } from "../models";
import { UpdateShippingOptionsInput } from "../types/service";
import FulfillmentProviderService from "./fulfillment-provider";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    fulfillmentSetService: ModulesSdkTypes.InternalModuleService<any>;
    serviceZoneService: ModulesSdkTypes.InternalModuleService<any>;
    geoZoneService: ModulesSdkTypes.InternalModuleService<any>;
    shippingProfileService: ModulesSdkTypes.InternalModuleService<any>;
    shippingOptionService: ModulesSdkTypes.InternalModuleService<any>;
    shippingOptionRuleService: ModulesSdkTypes.InternalModuleService<any>;
    shippingOptionTypeService: ModulesSdkTypes.InternalModuleService<any>;
    fulfillmentProviderService: FulfillmentProviderService;
    fulfillmentService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const FulfillmentModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, FulfillmentTypes.FulfillmentSetDTO, {
    FulfillmentSet: {
        dto: FulfillmentTypes.FulfillmentSetDTO;
    };
    ServiceZone: {
        dto: FulfillmentTypes.ServiceZoneDTO;
    };
    ShippingOption: {
        dto: FulfillmentTypes.ShippingOptionDTO;
    };
    GeoZone: {
        dto: FulfillmentTypes.GeoZoneDTO;
    };
    ShippingProfile: {
        dto: FulfillmentTypes.ShippingProfileDTO;
    };
    ShippingOptionRule: {
        dto: FulfillmentTypes.ShippingOptionRuleDTO;
    };
    ShippingOptionType: {
        dto: FulfillmentTypes.ShippingOptionTypeDTO;
    };
    FulfillmentProvider: {
        dto: FulfillmentTypes.FulfillmentProviderDTO;
    };
}>;
export default class FulfillmentModuleService<TEntity extends FulfillmentSet = FulfillmentSet, TServiceZoneEntity extends ServiceZone = ServiceZone, TGeoZoneEntity extends GeoZone = GeoZone, TShippingProfileEntity extends ShippingProfile = ShippingProfile, TShippingOptionEntity extends ShippingOption = ShippingOption, TShippingOptionRuleEntity extends ShippingOptionRule = ShippingOptionRule, TSippingOptionTypeEntity extends ShippingOptionType = ShippingOptionType, TFulfillmentEntity extends Fulfillment = Fulfillment> extends FulfillmentModuleService_base implements IFulfillmentModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected readonly fulfillmentSetService_: ModulesSdkTypes.InternalModuleService<TEntity>;
    protected readonly serviceZoneService_: ModulesSdkTypes.InternalModuleService<TServiceZoneEntity>;
    protected readonly geoZoneService_: ModulesSdkTypes.InternalModuleService<TGeoZoneEntity>;
    protected readonly shippingProfileService_: ModulesSdkTypes.InternalModuleService<TShippingProfileEntity>;
    protected readonly shippingOptionService_: ModulesSdkTypes.InternalModuleService<TShippingOptionEntity>;
    protected readonly shippingOptionRuleService_: ModulesSdkTypes.InternalModuleService<TShippingOptionRuleEntity>;
    protected readonly shippingOptionTypeService_: ModulesSdkTypes.InternalModuleService<TSippingOptionTypeEntity>;
    protected readonly fulfillmentProviderService_: FulfillmentProviderService;
    protected readonly fulfillmentService_: ModulesSdkTypes.InternalModuleService<TFulfillmentEntity>;
    constructor({ baseRepository, fulfillmentSetService, serviceZoneService, geoZoneService, shippingProfileService, shippingOptionService, shippingOptionRuleService, shippingOptionTypeService, fulfillmentProviderService, fulfillmentService, }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    listShippingOptions(filters?: FulfillmentTypes.FilterableShippingOptionForContextProps, config?: FindConfig<FulfillmentTypes.ShippingOptionDTO>, sharedContext?: Context): Promise<FulfillmentTypes.ShippingOptionDTO[]>;
    listShippingOptionsForContext(filters: FulfillmentTypes.FilterableShippingOptionForContextProps, config?: FindConfig<ShippingOptionDTO>, sharedContext?: Context): Promise<FulfillmentTypes.ShippingOptionDTO[]>;
    retrieveFulfillment(id: string, config?: FindConfig<FulfillmentTypes.FulfillmentDTO>, sharedContext?: Context): Promise<FulfillmentTypes.FulfillmentDTO>;
    listFulfillments(filters?: FulfillmentTypes.FilterableFulfillmentProps, config?: FindConfig<FulfillmentTypes.FulfillmentDTO>, sharedContext?: Context): Promise<FulfillmentTypes.FulfillmentDTO[]>;
    listAndCountFulfillments(filters?: FilterableFulfillmentSetProps, config?: FindConfig<FulfillmentDTO>, sharedContext?: Context): Promise<[FulfillmentDTO[], number]>;
    create(data: FulfillmentTypes.CreateFulfillmentSetDTO[], sharedContext?: Context): Promise<FulfillmentTypes.FulfillmentSetDTO[]>;
    create(data: FulfillmentTypes.CreateFulfillmentSetDTO, sharedContext?: Context): Promise<FulfillmentTypes.FulfillmentSetDTO>;
    protected create_(data: FulfillmentTypes.CreateFulfillmentSetDTO | FulfillmentTypes.CreateFulfillmentSetDTO[], sharedContext?: Context): Promise<TEntity | TEntity[]>;
    createServiceZones(data: FulfillmentTypes.CreateServiceZoneDTO[], sharedContext?: Context): Promise<FulfillmentTypes.ServiceZoneDTO[]>;
    createServiceZones(data: FulfillmentTypes.CreateServiceZoneDTO, sharedContext?: Context): Promise<FulfillmentTypes.ServiceZoneDTO>;
    protected createServiceZones_(data: FulfillmentTypes.CreateServiceZoneDTO[] | FulfillmentTypes.CreateServiceZoneDTO, sharedContext?: Context): Promise<TServiceZoneEntity | TServiceZoneEntity[]>;
    createShippingOptions(data: FulfillmentTypes.CreateShippingOptionDTO[], sharedContext?: Context): Promise<FulfillmentTypes.ShippingOptionDTO[]>;
    createShippingOptions(data: FulfillmentTypes.CreateShippingOptionDTO, sharedContext?: Context): Promise<FulfillmentTypes.ShippingOptionDTO>;
    createShippingOptions_(data: FulfillmentTypes.CreateShippingOptionDTO[] | FulfillmentTypes.CreateShippingOptionDTO, sharedContext?: Context): Promise<TShippingOptionEntity | TShippingOptionEntity[]>;
    createShippingProfiles(data: FulfillmentTypes.CreateShippingProfileDTO[], sharedContext?: Context): Promise<FulfillmentTypes.ShippingProfileDTO[]>;
    createShippingProfiles(data: FulfillmentTypes.CreateShippingProfileDTO, sharedContext?: Context): Promise<FulfillmentTypes.ShippingProfileDTO>;
    createShippingProfiles_(data: FulfillmentTypes.CreateShippingProfileDTO[] | FulfillmentTypes.CreateShippingProfileDTO, sharedContext?: Context): Promise<TShippingProfileEntity[] | TShippingProfileEntity>;
    createGeoZones(data: FulfillmentTypes.CreateGeoZoneDTO[], sharedContext?: Context): Promise<FulfillmentTypes.GeoZoneDTO[]>;
    createGeoZones(data: FulfillmentTypes.CreateGeoZoneDTO, sharedContext?: Context): Promise<FulfillmentTypes.GeoZoneDTO>;
    createShippingOptionRules(data: FulfillmentTypes.CreateShippingOptionRuleDTO[], sharedContext?: Context): Promise<FulfillmentTypes.ShippingOptionRuleDTO[]>;
    createShippingOptionRules(data: FulfillmentTypes.CreateShippingOptionRuleDTO, sharedContext?: Context): Promise<FulfillmentTypes.ShippingOptionRuleDTO>;
    createShippingOptionRules_(data: FulfillmentTypes.CreateShippingOptionRuleDTO[] | FulfillmentTypes.CreateShippingOptionRuleDTO, sharedContext?: Context): Promise<TShippingOptionRuleEntity | TShippingOptionRuleEntity[]>;
    createFulfillment(data: FulfillmentTypes.CreateFulfillmentDTO, sharedContext?: Context): Promise<FulfillmentTypes.FulfillmentDTO>;
    update(data: FulfillmentTypes.UpdateFulfillmentSetDTO[], sharedContext?: Context): Promise<FulfillmentTypes.FulfillmentSetDTO[]>;
    update(data: FulfillmentTypes.UpdateFulfillmentSetDTO, sharedContext?: Context): Promise<FulfillmentTypes.FulfillmentSetDTO>;
    protected update_(data: UpdateFulfillmentSetDTO[] | UpdateFulfillmentSetDTO, sharedContext?: Context): Promise<TEntity[] | TEntity>;
    updateServiceZones(id: string, data: FulfillmentTypes.UpdateServiceZoneDTO, sharedContext?: Context): Promise<FulfillmentTypes.ServiceZoneDTO>;
    updateServiceZones(selector: FulfillmentTypes.FilterableServiceZoneProps, data: FulfillmentTypes.UpdateServiceZoneDTO, sharedContext?: Context): Promise<FulfillmentTypes.ServiceZoneDTO[]>;
    protected updateServiceZones_(data: FulfillmentTypes.UpdateServiceZoneDTO[] | FulfillmentTypes.UpdateServiceZoneDTO, sharedContext?: Context): Promise<TServiceZoneEntity | TServiceZoneEntity[]>;
    upsertServiceZones(data: FulfillmentTypes.UpsertServiceZoneDTO, sharedContext?: Context): Promise<FulfillmentTypes.ServiceZoneDTO>;
    upsertServiceZones(data: FulfillmentTypes.UpsertServiceZoneDTO[], sharedContext?: Context): Promise<FulfillmentTypes.ServiceZoneDTO[]>;
    upsertServiceZones_(data: FulfillmentTypes.UpsertServiceZoneDTO[] | FulfillmentTypes.UpsertServiceZoneDTO, sharedContext?: Context): Promise<TServiceZoneEntity[] | TServiceZoneEntity>;
    updateShippingOptions(id: string, data: FulfillmentTypes.UpdateShippingOptionDTO, sharedContext?: Context): Promise<FulfillmentTypes.ShippingOptionDTO>;
    updateShippingOptions(selector: FulfillmentTypes.FilterableShippingOptionProps, data: FulfillmentTypes.UpdateShippingOptionDTO, sharedContext?: Context): Promise<FulfillmentTypes.ShippingOptionDTO[]>;
    updateShippingOptions_(data: UpdateShippingOptionsInput[] | UpdateShippingOptionsInput, sharedContext?: Context): Promise<TShippingOptionEntity | TShippingOptionEntity[]>;
    upsertShippingOptions(data: FulfillmentTypes.UpsertShippingOptionDTO[], sharedContext?: Context): Promise<FulfillmentTypes.ShippingOptionDTO[]>;
    upsertShippingOptions(data: FulfillmentTypes.UpsertShippingOptionDTO, sharedContext?: Context): Promise<FulfillmentTypes.ShippingOptionDTO>;
    upsertShippingOptions_(data: FulfillmentTypes.UpsertShippingOptionDTO[] | FulfillmentTypes.UpsertShippingOptionDTO, sharedContext?: Context): Promise<TShippingOptionEntity[] | TShippingOptionEntity>;
    updateShippingProfiles(data: FulfillmentTypes.UpdateShippingProfileDTO[], sharedContext?: Context): Promise<FulfillmentTypes.ShippingProfileDTO[]>;
    updateShippingProfiles(data: FulfillmentTypes.UpdateShippingProfileDTO, sharedContext?: Context): Promise<FulfillmentTypes.ShippingProfileDTO>;
    updateGeoZones(data: FulfillmentTypes.UpdateGeoZoneDTO[], sharedContext?: Context): Promise<FulfillmentTypes.GeoZoneDTO[]>;
    updateGeoZones(data: FulfillmentTypes.UpdateGeoZoneDTO, sharedContext?: Context): Promise<FulfillmentTypes.GeoZoneDTO>;
    updateShippingOptionRules(data: FulfillmentTypes.UpdateShippingOptionRuleDTO[], sharedContext?: Context): Promise<FulfillmentTypes.ShippingOptionRuleDTO[]>;
    updateShippingOptionRules(data: FulfillmentTypes.UpdateShippingOptionRuleDTO, sharedContext?: Context): Promise<FulfillmentTypes.ShippingOptionRuleDTO>;
    updateShippingOptionRules_(data: FulfillmentTypes.UpdateShippingOptionRuleDTO[] | FulfillmentTypes.UpdateShippingOptionRuleDTO, sharedContext?: Context): Promise<TShippingOptionRuleEntity | TShippingOptionRuleEntity[]>;
    updateFulfillment(id: string, data: FulfillmentTypes.UpdateFulfillmentDTO, sharedContext?: Context): Promise<FulfillmentTypes.FulfillmentDTO>;
    cancelFulfillment(id: string, sharedContext?: Context): Promise<FulfillmentDTO>;
    retrieveFulfillmentOptions(providerId: string): Promise<Record<string, any>[]>;
    validateFulfillmentOption(providerId: string, data: Record<string, unknown>): Promise<boolean>;
    validateShippingOption(shippingOptionId: string, context?: Record<string, unknown>, sharedContext?: Context): Promise<boolean>;
    protected static canCancelFulfillmentOrThrow(fulfillment: Fulfillment): boolean;
    protected static validateMissingShippingOptions_(shippingOptions: ShippingOption[], shippingOptionsData: UpdateShippingOptionsInput[]): void;
    protected static validateMissingShippingOptionRules(shippingOption: ShippingOption, shippingOptionUpdateData: FulfillmentTypes.UpdateShippingOptionDTO): void;
    protected static validateGeoZones(geoZones: ((Partial<FulfillmentTypes.CreateGeoZoneDTO> & {
        type: string;
    }) | (Partial<FulfillmentTypes.UpdateGeoZoneDTO> & {
        type: string;
    }))[]): void;
    protected static normalizeListShippingOptionsForContextParams(filters: FulfillmentTypes.FilterableShippingOptionForContextProps, config?: FindConfig<ShippingOptionDTO>): {
        filters: {
            id?: string | string[] | DAL.OperatorMap<string | string[]> | undefined;
            name?: string | string[] | DAL.OperatorMap<string | string[]> | undefined;
            shipping_profile_id?: string | string[] | DAL.OperatorMap<string | string[]> | undefined;
            price_type?: FulfillmentTypes.ShippingOptionPriceType | FulfillmentTypes.ShippingOptionPriceType[] | DAL.OperatorMap<FulfillmentTypes.ShippingOptionPriceType | FulfillmentTypes.ShippingOptionPriceType[]> | undefined;
            service_zone?: FulfillmentTypes.FilterableServiceZoneProps | undefined;
            shipping_option_type?: FulfillmentTypes.FilterableShippingOptionTypeProps | undefined;
            rules?: FulfillmentTypes.FilterableShippingOptionRuleProps | undefined;
            $and?: (FulfillmentTypes.FilterableShippingOptionProps | DAL.BaseFilterable<FulfillmentTypes.FilterableShippingOptionProps>)[] | undefined;
            $or?: (FulfillmentTypes.FilterableShippingOptionProps | DAL.BaseFilterable<FulfillmentTypes.FilterableShippingOptionProps>)[] | undefined;
        };
        config: {
            select?: string[] | undefined;
            skip?: number | null | undefined;
            take?: number | null | undefined;
            relations?: string[] | undefined;
            order?: {
                [K: string]: "ASC" | "DESC";
            } | undefined;
            withDeleted?: boolean | undefined;
            filters?: Record<string, any> | undefined;
        };
        context: Record<string, any> | undefined;
    };
    /**
     * Build the constraints for the geo zones based on the address properties
     * available and the hierarchy of required properties.
     * We build a OR constraint from the narrowest to the broadest
     * e.g. if we have a postal expression we build a constraint for the postal expression require props of type zip
     * and a constraint for the city required props of type city
     * and a constraint for the province code required props of type province
     * and a constraint for the country code required props of type country
     * example:
     * {
     *    $or: [
     *      {
     *        type: "zip",
     *        country_code: "SE",
     *        province_code: "AB",
     *        city: "Stockholm",
     *        postal_expression: "12345"
     *      },
     *      {
     *        type: "city",
     *        country_code: "SE",
     *        province_code: "AB",
     *        city: "Stockholm"
     *      },
     *      {
     *        type: "province",
     *        country_code: "SE",
     *        province_code: "AB"
     *      },
     *      {
     *        type: "country",
     *        country_code: "SE"
     *      }
     *    ]
     *  }
     */
    protected static buildGeoZoneConstraintsFromAddress(address: FulfillmentTypes.FilterableShippingOptionForContextProps["address"]): Record<string, any>[];
    protected aggregateFulfillmentSetCreatedEvents(createdFulfillmentSets: TEntity[], sharedContext: Context): void;
}
export {};
