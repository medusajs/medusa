import { AdminGetStoreCreditAccountsParams } from "../../../../../types";
import { useQueryParams } from "../../../../hooks/common/use-query-params";

type UseStoreCreditAccountsTableQueryProps = {
  prefix?: string;
  pageSize?: number;
};

export const useStoreCreditAccountsTableQuery = ({
  prefix,
  pageSize = 20,
}: UseStoreCreditAccountsTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "customer_id", "currency_code", "created_at", "updated_at"],
    prefix
  );

  const {
    offset,
    created_at,
    updated_at,
    customer_id,
    currency_code,
    ...rest
  } = queryObject;

  const searchParams: AdminGetStoreCreditAccountsParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    customer_id: customer_id ? JSON.parse(customer_id) : undefined,
    currency_code: currency_code ? JSON.parse(currency_code) : undefined,
    ...rest,
  };

  return searchParams;
};
