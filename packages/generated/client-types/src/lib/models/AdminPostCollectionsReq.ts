/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostCollectionsReq {
  /**
   * The title to identify the Collection by.
   */
  title: string
  /**
   * An optional handle to be used in slugs, if none is provided we will kebab-case the title.
   */
  handle?: string
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
