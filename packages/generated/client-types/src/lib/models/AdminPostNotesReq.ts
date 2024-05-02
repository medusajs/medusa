/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

/**
 * The details of the note to be created.
 */
export interface AdminPostNotesReq {
  /**
   * The ID of the resource which the Note relates to. For example, an order ID.
   */
  resource_id: string;
  /**
   * The type of resource which the Note relates to. For example, `order`.
   */
  resource_type: string;
  /**
   * The content of the Note to create.
   */
  value: string;
};


