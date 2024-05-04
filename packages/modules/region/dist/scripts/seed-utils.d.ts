import { RequiredEntityData } from "@mikro-orm/core";
import { SqlEntityManager } from "@mikro-orm/postgresql";
import { Region } from "../models";
export declare function createRegions(manager: SqlEntityManager, data: RequiredEntityData<Region>[]): Promise<Region[]>;
