/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Error } from "./Error"

export interface MultipleErrors {
  /**
   * Array of errors
   */
  errors?: Array<Error>
  message?: string
}
