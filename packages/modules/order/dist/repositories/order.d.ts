import { Context, DAL } from "@medusajs/types";
import { DALUtils } from "@medusajs/utils";
import { Order } from "../models";
declare const OrderRepository_base: new ({ manager }: {
    manager: any;
}) => DALUtils.MikroOrmBaseRepository<Order>;
export declare class OrderRepository extends OrderRepository_base {
    find(options?: DAL.FindOptions<Order>, context?: Context): Promise<Order[]>;
    findAndCount(findOptions?: DAL.FindOptions<Order>, context?: Context): Promise<[Order[], number]>;
}
export {};
