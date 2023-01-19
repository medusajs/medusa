/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminGetNotificationsParams } from '../models/AdminGetNotificationsParams';
import type { AdminNotificationsListRes } from '../models/AdminNotificationsListRes';
import type { AdminNotificationsRes } from '../models/AdminNotificationsRes';
import type { AdminPostNotificationsNotificationResendReq } from '../models/AdminPostNotificationsNotificationResendReq';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class NotificationService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetNotifications
   * List Notifications
   * Retrieves a list of Notifications.
   * @returns AdminNotificationsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetNotificationsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminNotificationsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/notifications',
      headers: customHeaders,
      query: {
        'offset': queryParams.offset,
        'limit': queryParams.limit,
        'fields': queryParams.fields,
        'expand': queryParams.expand,
        'event_name': queryParams.event_name,
        'resource_type': queryParams.resource_type,
        'resource_id': queryParams.resource_id,
        'to': queryParams.to,
        'include_resends': queryParams.include_resends,
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
   * PostNotificationsNotificationResend
   * Resend Notification
   * Resends a previously sent notifications, with the same data but optionally to a different address
   * @returns AdminNotificationsRes OK
   * @throws ApiError
   */
  public resend(
    id: string,
    requestBody: AdminPostNotificationsNotificationResendReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminNotificationsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/notifications/{id}/resend',
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

}
