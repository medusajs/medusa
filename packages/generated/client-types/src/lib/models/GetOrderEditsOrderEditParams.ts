/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface GetOrderEditsOrderEditParams {
  /**
   * Comma-separated relations that should be expanded in each returned order edit.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned order edit.
   */
  fields?: string
}
