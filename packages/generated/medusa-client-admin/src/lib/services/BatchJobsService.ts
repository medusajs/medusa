/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminBatchJobListRes,
  AdminBatchJobRes,
  AdminGetBatchParams,
  AdminPostBatchesReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class BatchJobsService {

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
      url: '/admin/batch-jobs',
      headers: customHeaders,
      query: queryParams,
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
      url: '/admin/batch-jobs',
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
      url: '/admin/batch-jobs/{id}',
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
      url: '/admin/batch-jobs/{id}/cancel',
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
      url: '/admin/batch-jobs/{id}/confirm',
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
