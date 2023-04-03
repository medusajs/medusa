import { AbstractSearchService } from "./abstract-service"

export function isSearchService(obj: unknown): boolean {
  return obj instanceof AbstractSearchService
}
