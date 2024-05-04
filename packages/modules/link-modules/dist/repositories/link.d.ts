import { Context, ModuleJoinerConfig } from "@medusajs/types";
import { EntitySchema } from "@mikro-orm/core";
export declare function getLinkRepository(model: EntitySchema): {
    new ({ joinerConfig }: {
        joinerConfig: ModuleJoinerConfig;
    }): {
        readonly joinerConfig_: ModuleJoinerConfig;
        delete(data: any, context?: Context): Promise<void>;
        create(data: object[], context?: Context): Promise<object[]>;
        update(data: {
            entity: any;
            update: any;
        }[], context?: Context | undefined): Promise<object[]>;
        find(options?: import("@medusajs/types").FindOptions<object> | undefined, context?: Context | undefined): Promise<object[]>;
        findAndCount(options?: import("@medusajs/types").FindOptions<object> | undefined, context?: Context | undefined): Promise<[object[], number]>;
        upsert(data: unknown[], context?: Context | undefined): Promise<object[]>;
        upsertWithReplace(data: unknown[], config?: import("@medusajs/types").UpsertWithReplaceConfig<object> | undefined, context?: Context | undefined): Promise<object[]>;
        softDelete(filters: string | string[] | (object & import("@medusajs/types").BaseFilterable<object>) | (object & import("@medusajs/types").BaseFilterable<object>)[], sharedContext?: Context | undefined): Promise<[object[], Record<string, unknown[]>]>;
        restore(idsOrFilter: string[] | {
            [x: string]: any;
        }, sharedContext?: Context | undefined): Promise<[object[], Record<string, unknown[]>]>;
        applyFreeTextSearchFilters<T>(findOptions: import("@medusajs/types").FindOptions<T & {
            q?: string | undefined;
        }>, retrieveConstraintsToApply: (q: string) => any[]): void;
        readonly manager_: any;
        getFreshManager<TManager = unknown>(): TManager;
        getActiveManager<TManager_1 = unknown>({ transactionManager, manager, }?: Context | undefined): TManager_1;
        transaction<TManager_2 = unknown>(task: (transactionManager: TManager_2) => Promise<any>, options?: {
            isolationLevel?: string | undefined;
            enableNestedTransactions?: boolean | undefined;
            transaction?: TManager_2 | undefined;
        } | undefined): Promise<any>;
        serialize<TOutput extends object | object[]>(data: any, options?: any): Promise<TOutput>;
    };
};
