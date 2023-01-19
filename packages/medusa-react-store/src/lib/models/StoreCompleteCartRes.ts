/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Cart } from './Cart';
import type { Order } from './Order';
import type { Swap } from './Swap';

export type StoreCompleteCartRes = {
  /**
   * The type of the data property.
   */
  type: 'order' | 'cart' | 'swap';
  /**
   * The data of the result object. Its type depends on the type field.
   */
  data: (Order | Cart | Swap);
};

