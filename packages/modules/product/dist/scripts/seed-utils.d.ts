import { SqlEntityManager } from "@mikro-orm/postgresql";
import { ProductCategory } from "../models";
export declare function createProductCategories(manager: SqlEntityManager, categoriesData: any[]): Promise<ProductCategory[]>;
export declare function createProducts(manager: SqlEntityManager, data: any[]): Promise<any[]>;
export declare function createProductVariants(manager: SqlEntityManager, data: any[]): Promise<any[]>;
