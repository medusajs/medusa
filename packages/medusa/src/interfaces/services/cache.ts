export interface ICacheService {
  get<T>(key: string): Promise<T | null>

  set<T = unknown>(key: string, data: T, ttl?: number): Promise<void>

  invalidate(key: string): Promise<void>
}
