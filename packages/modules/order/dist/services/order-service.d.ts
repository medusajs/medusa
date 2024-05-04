import { Context, DAL, FindConfig, OrderTypes, RepositoryService } from "@medusajs/types";
import { Order } from "../models";
type InjectedDependencies = {
    orderRepository: DAL.RepositoryService;
};
declare const OrderService_base: new <TEntity_1 extends object = any>(container: InjectedDependencies) => import("@medusajs/types").InternalModuleService<TEntity_1, InjectedDependencies>;
export default class OrderService<TEntity extends Order = Order> extends OrderService_base<TEntity> {
    protected readonly orderRepository_: RepositoryService<TEntity>;
    constructor(container: InjectedDependencies);
    retrieveOrderVersion<TEntityMethod = OrderTypes.OrderDTO>(id: string, version: number, config?: FindConfig<TEntityMethod>, sharedContext?: Context): Promise<TEntity>;
}
export {};
