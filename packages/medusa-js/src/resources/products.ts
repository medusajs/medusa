import {
  StoreGetProductsReq,
  StoreGetProductsResponse,
  StorePostSearchResponse,
  StoreProductsResponse,
} from '@medusajs/medusa';
import { AxiosPromise } from 'axios';
import BaseResource from './base';
import ProductVariantsResource from './product-variants';

class ProductsResource extends BaseResource {
  public variants = new ProductVariantsResource(this.client);

  /**
   * @description Retrieves a single Product
   * @param {string} id is required
   * @return {AxiosPromise<StoreProductsResponse>}
   */
  retrieve(id: string): AxiosPromise<StoreProductsResponse> {
    const path = `/store/products/${id}`;
    return this.client.request('GET', path);
  }

  /**
   * @description Retrieves a single Product
   * @param {string} id is required
   * @return {AxiosPromise<StorePostSearchResponse>}
   */
  search(id: string): AxiosPromise<StorePostSearchResponse> {
    const path = `/store/products/${id}`;
    return this.client.request('GET', path);
  }

  /**
   * @description Retrieves a list of products
   * @param {StoreGetProductsReq} query is optional. Can contain a limit and offset for the returned list
   * @return {AxiosPromise<StoreGetProductsResponse>}
   */
  list(query?: StoreGetProductsReq): AxiosPromise<StoreGetProductsResponse> {
    let path = `/store/products`;

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`;
      });

      path = `/store/products?${queryString.join('&')}`;
    }

    return this.client.request('GET', path);
  }
}

export default ProductsResource;
