/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGetVariantsVariantParams } from '../models/StoreGetVariantsVariantParams';
import type { StoreVariantsListRes } from '../models/StoreVariantsListRes';
import type { StoreVariantsRes } from '../models/StoreVariantsRes';

const { client } = useMedusaStore()

export const useProductVariantGetVariants = (
  queryParams: {
    /**
     * A comma separated list of Product Variant ids to filter by.
     */
    ids?: string,
    /**
     * A comma separated list of Product Variant relations to load.
     */
    expand?: string,
    /**
     * How many product variants to skip in the result.
     */
    offset?: number,
    /**
     * Maximum number of Product Variants to return.
     */
    limit?: number,
    /**
     * The id of the Cart to set prices based on.
     */
    cart_id?: string,
    /**
     * The id of the Region to set prices based on.
     */
    region_id?: string,
    /**
     * The currency code to use for price selection.
     */
    currency_code?: string,
    /**
     * product variant title to search for.
     */
    title?: (string | Array<string>),
    /**
     * Filter by available inventory quantity
     */
    inventory_quantity?: (number | {
      /**
       * filter by inventory quantity less than this number
       */
      lt?: number;
      /**
       * filter by inventory quantity greater than this number
       */
      gt?: number;
      /**
       * filter by inventory quantity less than or equal to this number
       */
      lte?: number;
      /**
       * filter by inventory quantity greater than or equal to this number
       */
      gte?: number;
    }),
  },
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productVariant.getVariants>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productVariant.getVariants>>>(
    ['productVariant', 'getVariants', queryParams],
    () => client.productVariant.getVariants(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductVariantRetrieve = (
  variantId: string,
  queryParams: StoreGetVariantsVariantParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productVariant.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productVariant.retrieve>>>(
    ['productVariant', 'retrieve', variantId,queryParams],
    () => client.productVariant.retrieve(variantId,queryParams),
    options
  );
  return { ...data, ...rest } as const
};


