export interface ICacheService {
  get<T>(key: string): Promise<T | null>

  set(key: string, data: unknown, ttl?: number): Promise<void>

  invalidate(key: string): Promise<void>
}
