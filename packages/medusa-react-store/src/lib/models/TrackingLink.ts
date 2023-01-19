/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Fulfillment } from './Fulfillment';

/**
 * Tracking Link holds information about tracking numbers for a Fulfillment. Tracking Links can optionally contain a URL that can be visited to see the status of the shipment.
 */
export type TrackingLink = {
  /**
   * The tracking link's ID
   */
  id?: string;
  /**
   * The URL at which the status of the shipment can be tracked.
   */
  url?: string;
  /**
   * The tracking number given by the shipping carrier.
   */
  tracking_number: string;
  /**
   * The id of the Fulfillment that the Tracking Link references.
   */
  fulfillment_id: string;
  /**
   * Available if the relation `fulfillment` is expanded.
   */
  fulfillment?: Fulfillment;
  /**
   * Randomly generated key used to continue the completion of a process in case of failure.
   */
  idempotency_key?: string;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at?: string;
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>;
};

