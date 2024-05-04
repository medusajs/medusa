import { BaseFilterable, Context, DAL, FilterQuery, FilterQuery as InternalFilterQuery, RepositoryService, RepositoryTransformOptions, UpsertWithReplaceConfig } from "@medusajs/types";
import { EntitySchema } from "@mikro-orm/core";
import { EntityClass } from "@mikro-orm/core/typings";
export declare class MikroOrmBase<T = any> {
    readonly manager_: any;
    protected constructor({ manager }: {
        manager: any;
    });
    getFreshManager<TManager = unknown>(): TManager;
    getActiveManager<TManager = unknown>({ transactionManager, manager, }?: Context): TManager;
    transaction<TManager = unknown>(task: (transactionManager: TManager) => Promise<any>, options?: {
        isolationLevel?: string;
        enableNestedTransactions?: boolean;
        transaction?: TManager;
    }): Promise<any>;
    serialize<TOutput extends object | object[]>(data: any, options?: any): Promise<TOutput>;
}
/**
 * Privileged extends of the abstract classes unless most of the methods can't be implemented
 * in your repository. This base repository is also used to provide a base repository
 * injection if needed to be able to use the common methods without being related to an entity.
 * In this case, none of the method will be implemented except the manager and transaction
 * related ones.
 */
export declare class MikroOrmBaseRepository<T extends object = object> extends MikroOrmBase<T> implements RepositoryService<T> {
    constructor(...args: any[]);
    static buildUniqueCompositeKeyValue(keys: string[], data: object): string;
    static retrievePrimaryKeys(entity: EntityClass<any> | EntitySchema): string[];
    create(data: unknown[], context?: Context): Promise<T[]>;
    update(data: {
        entity: any;
        update: any;
    }[], context?: Context): Promise<T[]>;
    delete(idsOrPKs: FilterQuery<T> & BaseFilterable<FilterQuery<T>>, context?: Context): Promise<void>;
    find(options?: DAL.FindOptions<T>, context?: Context): Promise<T[]>;
    findAndCount(options?: DAL.FindOptions<T>, context?: Context): Promise<[T[], number]>;
    upsert(data: unknown[], context?: Context): Promise<T[]>;
    upsertWithReplace(data: unknown[], config?: UpsertWithReplaceConfig<T>, context?: Context): Promise<T[]>;
    softDelete(filters: string | string[] | (FilterQuery<T> & BaseFilterable<FilterQuery<T>>) | (FilterQuery<T> & BaseFilterable<FilterQuery<T>>)[], sharedContext?: Context): Promise<[T[], Record<string, unknown[]>]>;
    restore(idsOrFilter: string[] | InternalFilterQuery, sharedContext?: Context): Promise<[T[], Record<string, unknown[]>]>;
    applyFreeTextSearchFilters<T>(findOptions: DAL.FindOptions<T & {
        q?: string;
    }>, retrieveConstraintsToApply: (q: string) => any[]): void;
}
export declare class MikroOrmBaseTreeRepository<T extends object = object> extends MikroOrmBase<T> {
    constructor();
    find(options?: DAL.FindOptions, transformOptions?: RepositoryTransformOptions, context?: Context): Promise<T[]>;
    findAndCount(options?: DAL.FindOptions, transformOptions?: RepositoryTransformOptions, context?: Context): Promise<[T[], number]>;
    create(data: unknown, context?: Context): Promise<T>;
    delete(id: string, context?: Context): Promise<void>;
}
export declare function mikroOrmBaseRepositoryFactory<T extends object = object>(entity: any): {
    new ({ manager }: {
        manager: any;
    }): MikroOrmBaseRepository<T>;
};
