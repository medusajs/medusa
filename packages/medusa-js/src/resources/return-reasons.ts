import BaseResource from './base';
import * as Types from '../types';

class ReturnReasonsResource extends BaseResource {
  /**
   * @description Retrieves a single Return Reason
   * @param id is required
   * @returns AsyncResult<{ return_reason: ReturnReason }>
   */
  retrieve(id: string): Types.AsyncResult<{ return_reason: Types.ReturnReason }> {
    const path = `/store/return-reasons/${id}`;
    return this.client.request('GET', path);
  }

  /**
   * Lists return reasons defined in Medusa Admin
   * @returns AsyncResult<{ return_reasons: ReturnReason[] }>
   */
  list(): Types.AsyncResult<{ return_reasons: Types.ReturnReason[] }> {
    const path = `/store/return-reasons`;
    return this.client.request('GET', path);
  }
}

export default ReturnReasonsResource;
