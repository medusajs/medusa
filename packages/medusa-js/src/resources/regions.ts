import BaseResource from './base';
import * as Types from '../types';

class RegionsResource extends BaseResource {
  /**
   * @description Retrieves a list of regions
   * @returns AsyncResult<{ regions: Region[] }>
   */
  list(): Types.AsyncResult<{ regions: Types.Region[] }> {
    const path = `/store/regions`;
    return this.client.request('GET', path);
  }

  /**
   * @description Retrieves a region
   * @param id is required
   * @returns AsyncResult<{ region: Region }>
   */
  retrieve(id: string): Types.AsyncResult<{ region: Types.Region }> {
    const path = `/store/regions/${id}`;
    return this.client.request('GET', path);
  }
}

export default RegionsResource;
