import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types";
import { ProductCategory } from "../models";
type InjectedDependencies = {
    productCategoryRepository: DAL.TreeRepositoryService;
};
export default class ProductCategoryService<TEntity extends ProductCategory = ProductCategory> {
    protected readonly productCategoryRepository_: DAL.TreeRepositoryService;
    constructor({ productCategoryRepository }: InjectedDependencies);
    retrieve(productCategoryId: string, config?: FindConfig<ProductTypes.ProductCategoryDTO>, sharedContext?: Context): Promise<TEntity>;
    list(filters?: ProductTypes.FilterableProductCategoryProps, config?: FindConfig<ProductTypes.ProductCategoryDTO>, sharedContext?: Context): Promise<TEntity[]>;
    listAndCount(filters?: ProductTypes.FilterableProductCategoryProps, config?: FindConfig<ProductTypes.ProductCategoryDTO>, sharedContext?: Context): Promise<[TEntity[], number]>;
    create(data: ProductTypes.CreateProductCategoryDTO, sharedContext?: Context): Promise<TEntity>;
    update(id: string, data: ProductTypes.UpdateProductCategoryDTO, sharedContext?: Context): Promise<TEntity>;
    delete(id: string, sharedContext?: Context): Promise<void>;
}
export {};
