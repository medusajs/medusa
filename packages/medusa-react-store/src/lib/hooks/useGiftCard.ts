/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGiftCardsRes } from '../models/StoreGiftCardsRes';

const { client } = useMedusaStore()

export const useGiftCardRetrieve = (
  code: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.giftCard.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.giftCard.retrieve>>>(
    ['giftCard', 'retrieve', code],
    () => client.giftCard.retrieve(code),
    options
  );
  return { ...data, ...rest } as const
};


