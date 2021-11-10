import BaseResource from './base';
import ProductVariantsResource from './product-variants';
import * as Types from '../types';
import { ProductListPayload } from '../types';

class ProductsResource extends BaseResource {
  public variants = new ProductVariantsResource(this.client);

  /**
   * @description Retrieves a single Product
   * @param id is required
   * @returns AsyncResult<{ product: Product }>
   */
  retrieve(id: string): Types.AsyncResult<{ product: Types.Product }> {
    const path = `/store/products/${id}`;
    return this.client.request('GET', path);
  }

  /**
   * @description Retrieves a list of products
   * @param query is optional. Can contain a limit and offset for the returned list
   * @returns AsyncResult<{ products: Product[] }>
   */
  list(query?: ProductListPayload): Types.AsyncResult<{ products: Types.Product[] }> {
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
