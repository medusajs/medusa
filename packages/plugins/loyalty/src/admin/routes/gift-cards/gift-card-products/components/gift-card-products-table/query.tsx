import { AdminGetGiftCardsParams } from "../../../../../../types";
import { useQueryParams } from "../../../../../hooks/common/use-query-params";

type UseGiftCardTableQueryProps = {
  prefix?: string;
  pageSize?: number;
};

export const useGiftCardProductsTableQuery = ({
  prefix,
  pageSize = 20,
}: UseGiftCardTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "customer_id", "created_at", "updated_at"],
    prefix
  );

  const { offset, created_at, updated_at, customer_id, ...rest } = queryObject;

  const searchParams: AdminGetGiftCardsParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    customer_id: customer_id ? JSON.parse(customer_id) : undefined,
    ...rest,
  };

  return searchParams;
};
