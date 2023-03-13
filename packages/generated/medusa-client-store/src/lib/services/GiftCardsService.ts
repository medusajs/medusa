/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreGiftCardsRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class GiftCardsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetGiftCardsCode
   * Get Gift Card by Code
   * Retrieves a Gift Card by its associated unique code.
   * @returns StoreGiftCardsRes OK
   * @throws ApiError
   */
  public retrieve(
    code: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreGiftCardsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/gift-cards/{code}',
      path: {
        'code': code,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

}
