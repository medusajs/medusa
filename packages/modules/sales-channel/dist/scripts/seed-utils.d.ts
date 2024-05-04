import { SalesChannel } from "../models";
import { RequiredEntityData } from "@mikro-orm/core";
import { SqlEntityManager } from "@mikro-orm/postgresql";
export declare function createSalesChannels(manager: SqlEntityManager, data: RequiredEntityData<SalesChannel>[]): Promise<SalesChannel[]>;
