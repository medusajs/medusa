import { EntityClass } from "@mikro-orm/core/typings";
import { EntitySchema } from "@mikro-orm/core";
import { SqlEntityManager } from "@mikro-orm/postgresql";
import type { FindOneOptions, FindOptions } from "@mikro-orm/core/drivers";
export declare const FreeTextSearchFilterKey = "freeTextSearch";
interface FilterArgument {
    value: string;
    fromEntity: string;
}
export declare const mikroOrmFreeTextSearchFilterOptionsFactory: (models: (EntityClass<any> | EntitySchema)[]) => {
    cond: (freeTextSearchArgs: FilterArgument, operation: string, manager: SqlEntityManager, options?: (FindOptions<any, any> | FindOneOptions<any, any>) & {
        visited?: Set<EntityClass<any>>;
    }) => {
        $or?: undefined;
    } | {
        $or: any;
    };
    default: boolean;
    args: boolean;
    entity: string[];
};
export {};
