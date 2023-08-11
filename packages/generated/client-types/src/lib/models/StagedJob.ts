/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * A staged job resource
 */
export interface StagedJob {
  /**
   * The staged job's ID
   */
  id: string
  /**
   * The name of the event
   */
  event_name: string
  /**
   * Data necessary for the job
   */
  data: Record<string, any>
  /**
   * The staged job's option
   */
  option?: Record<string, any>
}
