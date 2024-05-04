export declare function transactionWrapper<TManager = unknown>(manager: any, task: (transactionManager: any) => Promise<any>, { transaction, isolationLevel, enableNestedTransactions, }?: {
    isolationLevel?: string;
    transaction?: TManager;
    enableNestedTransactions?: boolean;
}): Promise<any>;
/**
 * Can be used to create a new Object that collect the entities
 * based on the columnLookup. This is useful when you want to soft delete entities and return
 * an object where the keys are the entities name and the values are the entities
 * that were soft deleted.
 *
 * @param entities
 * @param deletedEntitiesMap
 * @param getEntityName
 */
export declare function getSoftDeletedCascadedEntitiesIdsMappedBy({ entities, deletedEntitiesMap, getEntityName, restored, }: {
    entities: any[];
    deletedEntitiesMap?: Map<string, any[]>;
    getEntityName?: (entity: any) => string;
    restored?: boolean;
}): Record<string, any[]>;
