/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface Error {
  /**
   * A slug code to indicate the type of the error.
   */
  code?: string
  /**
   * Description of the error that occurred.
   */
  message?: string
  /**
   * A slug indicating the type of the error.
   */
  type?: string
}
