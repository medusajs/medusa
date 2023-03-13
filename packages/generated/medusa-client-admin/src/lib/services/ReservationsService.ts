/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminGetReservationsParams,
  AdminPostReservationsReq,
  AdminPostReservationsReservationReq,
  AdminReservationsDeleteRes,
  AdminReservationsListRes,
  AdminReservationsRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ReservationsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetReservations
   * List Reservations
   * Retrieve a list of Reservations.
   * @returns AdminReservationsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetReservationsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReservationsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/reservations',
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
   * PostReservations
   * Creates a Reservation
   * Creates a Reservation which can be associated with any resource as required.
   * @returns AdminReservationsRes OK
   * @throws ApiError
   */
  public postReservations(
    requestBody: AdminPostReservationsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReservationsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/reservations',
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
   * GetReservationsReservation
   * Get a Reservation
   * Retrieves a single reservation using its id
   * @returns AdminReservationsRes OK
   * @throws ApiError
   */
  public getReservationsReservation(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReservationsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/reservations/{id}',
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
   * PostReservationsReservation
   * Updates a Reservation
   * Updates a Reservation which can be associated with any resource as required.
   * @returns AdminReservationsRes OK
   * @throws ApiError
   */
  public postReservationsReservation(
    id: string,
    requestBody: AdminPostReservationsReservationReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReservationsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/reservations/{id}',
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
   * DeleteReservationsReservation
   * Delete a Reservation
   * Deletes a Reservation.
   * @returns AdminReservationsDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReservationsDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/reservations/{id}',
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
