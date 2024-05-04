import { Product } from "../models";
import { Context, DAL } from "@medusajs/types";
import { DALUtils } from "@medusajs/utils";
declare const ProductRepository_base: new ({ manager }: {
    manager: any;
}) => DALUtils.MikroOrmBaseRepository<Product>;
export declare class ProductRepository extends ProductRepository_base {
    constructor(...args: any[]);
    /**
     * In order to be able to have a strict not in categories, and prevent a product
     * to be return in the case it also belongs to other categories, we need to
     * first find all products that are in the categories, and then exclude them
     */
    protected mutateNotInCategoriesConstraints(findOptions?: DAL.FindOptions<Product>, context?: Context): Promise<void>;
}
export {};
