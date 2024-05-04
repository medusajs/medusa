import { ICacheService } from "@medusajs/types";
import { Redis } from "ioredis";
import { RedisCacheModuleOptions } from "../types";
type InjectedDependencies = {
    cacheRedisConnection: Redis;
};
declare class RedisCacheService implements ICacheService {
    protected readonly TTL: number;
    protected readonly redis: Redis;
    private readonly namespace;
    constructor({ cacheRedisConnection }: InjectedDependencies, options?: RedisCacheModuleOptions);
    __hooks: {
        onApplicationShutdown: () => Promise<void>;
    };
    /**
     * Set a key/value pair to the cache.
     * If the ttl is 0 it will act like the value should not be cached at all.
     * @param key
     * @param data
     * @param ttl
     */
    set(key: string, data: Record<string, unknown>, ttl?: number): Promise<void>;
    /**
     * Retrieve a cached value belonging to the given key.
     * @param cacheKey
     */
    get<T>(cacheKey: string): Promise<T | null>;
    /**
     * Invalidate cache for a specific key. a key can be either a specific key or more global such as "ps:*".
     * @param key
     */
    invalidate(key: string): Promise<void>;
    /**
     * Returns namespaced cache key
     * @param key
     */
    private getCacheKey;
}
export default RedisCacheService;
