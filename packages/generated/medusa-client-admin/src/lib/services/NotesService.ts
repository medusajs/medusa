/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminGetNotesParams,
  AdminNotesDeleteRes,
  AdminNotesListRes,
  AdminNotesRes,
  AdminPostNotesNoteReq,
  AdminPostNotesReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class NotesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetNotes
   * List Notes
   * Retrieves a list of notes
   * @returns AdminNotesListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetNotesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminNotesListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/notes',
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
   * PostNotes
   * Creates a Note
   * Creates a Note which can be associated with any resource as required.
   * @returns AdminNotesRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostNotesReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminNotesRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/notes',
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
   * GetNotesNote
   * Get a Note
   * Retrieves a single note using its id
   * @returns AdminNotesRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminNotesRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/notes/{id}',
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
   * PostNotesNote
   * Update a Note
   * Updates a Note associated with some resource
   * @returns AdminNotesRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostNotesNoteReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminNotesRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/notes/{id}',
      path: {
        'id': id,
      },
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
   * DeleteNotesNote
   * Delete a Note
   * Deletes a Note.
   * @returns AdminNotesDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminNotesDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/notes/{id}',
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
