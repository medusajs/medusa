/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminInviteDeleteRes,
  AdminListInvitesRes,
  AdminPostInvitesInviteAcceptReq,
  AdminPostInvitesReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class InvitesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetInvites
   * Lists Invites
   * Lists all Invites
   * @returns AdminListInvitesRes OK
   * @throws ApiError
   */
  public list(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminListInvitesRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/invites',
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
   * PostInvites
   * Create an Invite
   * Creates an Invite and triggers an 'invite' created event
   * @returns any OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostInvitesReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/invites',
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
   * PostInvitesInviteAccept
   * Accept an Invite
   * Accepts an Invite and creates a corresponding user
   * @returns any OK
   * @throws ApiError
   */
  public accept(
    requestBody: AdminPostInvitesInviteAcceptReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/invites/accept',
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
   * DeleteInvitesInvite
   * Delete an Invite
   * Deletes an Invite
   * @returns AdminInviteDeleteRes OK
   * @throws ApiError
   */
  public delete(
    inviteId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminInviteDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/invites/{invite_id}',
      path: {
        'invite_id': inviteId,
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
   * PostInvitesInviteResend
   * Resend an Invite
   * Resends an Invite by triggering the 'invite' created event again
   * @returns any OK
   * @throws ApiError
   */
  public resend(
    inviteId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/invites/{invite_id}/resend',
      path: {
        'invite_id': inviteId,
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
