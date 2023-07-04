/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export type StorePostSearchRes = {
  /**
   * Array of results. The format of the items depends on the search engine installed on the server.
   */
  hits: any[]
} & Record<string, any>
