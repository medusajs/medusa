/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostCollectionsReq {
  /**
   * The title of the collection.
   */
  title: string
  /**
   * An optional handle to be used in slugs. If none is provided, the kebab-case version of the title will be used.
   */
  handle?: string
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
