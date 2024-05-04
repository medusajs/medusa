import { Context, DAL } from "@medusajs/types";
import { PriceList } from "../models";
import { ServiceTypes } from "../types";
type InjectedDependencies = {
    priceListRepository: DAL.RepositoryService;
};
declare const PriceListService_base: new <TEntity_1 extends object = any>(container: InjectedDependencies) => import("@medusajs/types").InternalModuleService<TEntity_1, InjectedDependencies>;
export default class PriceListService<TEntity extends PriceList = PriceList> extends PriceListService_base<TEntity> {
    constructor(container: InjectedDependencies);
    create(data: ServiceTypes.CreatePriceListDTO[], sharedContext?: Context): Promise<TEntity[]>;
    create(data: ServiceTypes.CreatePriceListDTO, sharedContext?: Context): Promise<TEntity>;
    update(data: any[], sharedContext?: Context): Promise<TEntity[]>;
    update(data: any, sharedContext?: Context): Promise<TEntity>;
    protected normalizePriceListDate(data: (ServiceTypes.UpdatePriceListDTO | ServiceTypes.CreatePriceListDTO)[]): any[];
}
export {};
