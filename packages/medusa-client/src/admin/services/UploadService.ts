/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminDeleteUploadsReq } from '../models/AdminDeleteUploadsReq';
import type { AdminDeleteUploadsRes } from '../models/AdminDeleteUploadsRes';
import type { AdminPostUploadsDownloadUrlReq } from '../models/AdminPostUploadsDownloadUrlReq';
import type { AdminUploadsDownloadUrlRes } from '../models/AdminUploadsDownloadUrlRes';
import type { AdminUploadsRes } from '../models/AdminUploadsRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UploadService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * PostUploads
   * Upload files
   * Uploads at least one file to the specific fileservice that is installed in Medusa.
   * @returns AdminUploadsRes OK
   * @throws ApiError
   */
  public postUploads(
    formData: {
      files?: Blob;
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminUploadsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/uploads',
      headers: customHeaders,
      formData: formData,
      mediaType: 'multipart/form-data',
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
   * AdminDeleteUploads
   * Delete an Uploaded File
   * Removes an uploaded file using the installed fileservice
   * @returns AdminDeleteUploadsRes OK
   * @throws ApiError
   */
  public adminDeleteUploads(
    requestBody: AdminDeleteUploadsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDeleteUploadsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/uploads',
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
   * PostUploadsDownloadUrl
   * Get a File's Download URL
   * Creates a presigned download url for a file
   * @returns AdminUploadsDownloadUrlRes OK
   * @throws ApiError
   */
  public postUploadsDownloadUrl(
    requestBody: AdminPostUploadsDownloadUrlReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminUploadsDownloadUrlRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/uploads/download-url',
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
   * PostUploadsProtected
   * Protected File Upload
   * Uploads at least one file with ACL or a non-public bucket to the specific fileservice that is installed in Medusa.
   * @returns AdminUploadsRes OK
   * @throws ApiError
   */
  public postUploadsProtected(
    formData: {
      files?: Blob;
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminUploadsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/uploads/protected',
      headers: customHeaders,
      formData: formData,
      mediaType: 'multipart/form-data',
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
