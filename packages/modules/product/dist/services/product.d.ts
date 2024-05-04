import { Context, DAL, FindConfig, ProductTypes, FilterableProductProps } from "@medusajs/types";
import { Product } from "../models";
type InjectedDependencies = {
    productRepository: DAL.RepositoryService;
};
type NormalizedFilterableProductProps = ProductTypes.FilterableProductProps & {
    categories?: {
        id: string | {
            $in: string[];
        };
    };
};
declare const ProductService_base: new <TEntity_1 extends object = any>(container: InjectedDependencies) => import("@medusajs/types").InternalModuleService<TEntity_1, InjectedDependencies>;
export default class ProductService<TEntity extends Product = Product> extends ProductService_base<TEntity> {
    protected readonly productRepository_: DAL.RepositoryService<TEntity>;
    constructor({ productRepository }: InjectedDependencies);
    list(filters?: ProductTypes.FilterableProductProps, config?: FindConfig<TEntity>, sharedContext?: Context): Promise<TEntity[]>;
    listAndCount(filters?: ProductTypes.FilterableProductProps, config?: FindConfig<any>, sharedContext?: Context): Promise<[TEntity[], number]>;
    protected static normalizeFilters(filters?: FilterableProductProps): NormalizedFilterableProductProps;
}
export {};
