import { AxiosPromise } from 'axios';
import { StoreGetAuthEmailRes, StorePostAuthReq, StoreAuthRes } from '@medusajs/medusa';
import BaseResource from './base';

class AuthResource extends BaseResource {
  /**
   * @description Authenticates a customer using email and password combination
   * @returns AxiosPromise<StoreAuthRes>
   */
  authenticate(payload: StorePostAuthReq): AxiosPromise<StoreAuthRes> {
    const path = `/store/auth`;
    return this.client.request('POST', path, payload);
  }

  /**
   * @description Retrieves an authenticated session
   * Usually used to check if authenticated session is alive.
   * @returns AxiosPromise<StoreAuthRes>
   */
  getSession(): AxiosPromise<StoreAuthRes> {
    const path = `/store/auth`;
    return this.client.request('GET', path);
  }

  /**
   * @description Check if email exists
   * @param email is required
   * @returns AxiosPromise<StoreGetAuthEmailRes>
   */
  exists(email: string): AxiosPromise<StoreGetAuthEmailRes> {
    const path = `/store/auth/${email}`;
    return this.client.request('GET', path);
  }
}

export default AuthResource;
