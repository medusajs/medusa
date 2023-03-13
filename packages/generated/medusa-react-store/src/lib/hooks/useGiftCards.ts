/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGiftCardsRes } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useGiftCardsRetrieve = (
  code: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.giftCards.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.giftCards.retrieve>>>(
    ['giftCards', 'retrieve', code],
    () => client.giftCards.retrieve(code),
    options
  );
  return { ...data, ...rest } as const
};


