import { BaseCollection, BaseCollectionFilters } from "./common"

export interface AdminCollection extends BaseCollection {}
export interface AdminCollectionFilters extends BaseCollectionFilters {}

export interface AdminCreateCollection {
  title: string
  handle?: string
  metadata?: Record<string, any>
}
export interface AdminUpdateCollection extends Partial<AdminCreateCollection> {}

export interface AdminUpdateCollectionProducts {
  add?: string[]
  remove?: string[]
}
