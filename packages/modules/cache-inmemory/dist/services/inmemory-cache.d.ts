/// <reference types="node" />
import { ICacheService } from "@medusajs/types";
import { CacheRecord, InMemoryCacheModuleOptions } from "../types";
type InjectedDependencies = {};
/**
 * Class represents basic, in-memory, cache store.
 */
declare class InMemoryCacheService implements ICacheService {
    protected readonly TTL: number;
    protected readonly store: Map<string, CacheRecord<any>>;
    protected readonly timoutRefs: Map<string, NodeJS.Timeout>;
    constructor(deps: InjectedDependencies, options?: InMemoryCacheModuleOptions);
    /**
     * Retrieve data from the cache.
     * @param key - cache key
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Set data to the cache.
     * @param key - cache key under which the data is stored
     * @param data - data to be stored in the cache
     * @param ttl - expiration time in seconds
     */
    set<T>(key: string, data: T, ttl?: number): Promise<void>;
    /**
     * Delete data from the cache.
     * Could use wildcard (*) matcher e.g. `invalidate("ps:*")` to delete all keys that start with "ps:"
     *
     * @param key - cache key
     */
    invalidate(key: string): Promise<void>;
    /**
     * Delete the entire cache.
     */
    clear(): Promise<void>;
}
export default InMemoryCacheService;
