/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The product's type.
 */
export interface CreateProductType {
  /**
   * The type's ID.
   */
  id?: string
  /**
   * The type's value.
   */
  value: string
  /**
   * The type's metadata.
   */
  metadata?: any
}
