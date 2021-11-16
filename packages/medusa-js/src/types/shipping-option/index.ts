
import { StoreGetShippingOptionsParams } from '@medusajs/medusa';

export type StoreGetShippingOptionsParamsObject = Omit<StoreGetShippingOptionsParams, 'product_ids'> & {
  product_ids?: string[]
}