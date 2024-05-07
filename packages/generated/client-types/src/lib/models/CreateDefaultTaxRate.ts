/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The tax region's default tax rate.
 */
export interface CreateDefaultTaxRate {
  /**
   * The default tax rate's rate.
   */
  rate?: number
  /**
   * The default tax rate's code.
   */
  code?: string
  /**
   * The default tax rate's name.
   */
  name: string
  /**
   * The default tax rate's metadata.
   */
  metadata?: any
}
