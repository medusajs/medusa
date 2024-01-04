/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The list of search results.
 */
export type StorePostSearchRes = {
  /**
   * Array of search results. The format of the items depends on the search engine installed on the Medusa backend.
   */
  hits: any[]
} & Record<string, any>
