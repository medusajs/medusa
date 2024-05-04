import { Context, FindConfig } from "@medusajs/types";
type InjectedDependencies = {
    linkRepository: any;
};
export default class LinkService<TEntity> {
    protected readonly linkRepository_: any;
    constructor({ linkRepository }: InjectedDependencies);
    list(filters?: unknown, config?: FindConfig<unknown>, sharedContext?: Context): Promise<TEntity[]>;
    listAndCount(filters?: {}, config?: FindConfig<unknown>, sharedContext?: Context): Promise<[TEntity[], number]>;
    create(data: unknown[], sharedContext?: Context): Promise<TEntity[]>;
    dismiss(data: unknown[], sharedContext?: Context): Promise<TEntity[]>;
    delete(data: unknown, sharedContext?: Context): Promise<void>;
    softDelete(data: any[], sharedContext?: Context): Promise<[object[], Record<string, string[]>]>;
    restore(data: any, sharedContext?: Context): Promise<[object[], Record<string, string[]>]>;
}
export {};
