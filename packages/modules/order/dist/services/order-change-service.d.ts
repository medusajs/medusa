import { Context, DAL, FindConfig, OrderTypes, RepositoryService } from "@medusajs/types";
import { OrderChange } from "../models";
type InjectedDependencies = {
    orderChangeRepository: DAL.RepositoryService;
};
declare const OrderChangeService_base: new <TEntity_1 extends object = any>(container: InjectedDependencies) => import("@medusajs/types").InternalModuleService<TEntity_1, InjectedDependencies>;
export default class OrderChangeService<TEntity extends OrderChange = OrderChange> extends OrderChangeService_base<TEntity> {
    protected readonly orderChangeRepository_: RepositoryService<TEntity>;
    constructor(container: InjectedDependencies);
    listCurrentOrderChange<TEntityMethod = OrderTypes.OrderDTO>(orderId: string | string[], config?: FindConfig<TEntityMethod>, sharedContext?: Context): Promise<TEntity[]>;
    isActive(orderChange: OrderChange): boolean;
    create(data: Partial<TEntity>[], sharedContext?: Context): Promise<TEntity[]>;
    create(data: Partial<TEntity>, sharedContext?: Context): Promise<TEntity>;
}
export {};
