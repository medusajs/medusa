/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminBatchJobListRes } from '../models/AdminBatchJobListRes';
import type { AdminBatchJobRes } from '../models/AdminBatchJobRes';
import type { AdminGetBatchParams } from '../models/AdminGetBatchParams';
import type { AdminPostBatchesReq } from '../models/AdminPostBatchesReq';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class BatchJobService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetBatchJobs
   * List Batch Jobs
   * Retrieve a list of Batch Jobs.
   * @returns AdminBatchJobListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetBatchParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminBatchJobListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/batch-jobs',
      headers: customHeaders,
      query: {
        'limit': queryParams.limit,
        'offset': queryParams.offset,
        'id': queryParams.id,
        'type': queryParams.type,
        'confirmed_at': queryParams.confirmed_at,
        'pre_processed_at': queryParams.pre_processed_at,
        'completed_at': queryParams.completed_at,
        'failed_at': queryParams.failed_at,
        'canceled_at': queryParams.canceled_at,
        'order': queryParams.order,
        'expand': queryParams.expand,
        'fields': queryParams.fields,
        'created_at': queryParams.created_at,
        'updated_at': queryParams.updated_at,
      },
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostBatchJobs
   * Create a Batch Job
   * Creates a Batch Job.
   * @returns AdminBatchJobRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostBatchesReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminBatchJobRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/batch-jobs',
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * GetBatchJobsBatchJob
   * Get a Batch Job
   * Retrieves a Batch Job.
   * @returns AdminBatchJobRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminBatchJobRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/batch-jobs/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostBatchJobsBatchJobCancel
   * Cancel a Batch Job
   * Marks a batch job as canceled
   * @returns AdminBatchJobRes OK
   * @throws ApiError
   */
  public cancel(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminBatchJobRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/batch-jobs/{id}/cancel',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostBatchJobsBatchJobConfirmProcessing
   * Confirm a Batch Job
   * Confirms that a previously requested batch job should be executed.
   * @returns AdminBatchJobRes OK
   * @throws ApiError
   */
  public confirm(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminBatchJobRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/batch-jobs/{id}/confirm',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

}
