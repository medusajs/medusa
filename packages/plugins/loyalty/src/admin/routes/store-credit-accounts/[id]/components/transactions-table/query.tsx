import { AdminGetTransactionsParams } from "../../../../../../types";
import { useQueryParams } from "../../../../../hooks/common/use-query-params";

type UseStoreCreditAccountsTableQueryProps = {
  prefix?: string;
  pageSize?: number;
};

export const useTransactionsTableQuery = ({
  prefix,
  pageSize = 20,
}: UseStoreCreditAccountsTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "limit", "currency_code", "created_at", "updated_at"],
    prefix
  );

  const { offset, limit, created_at, updated_at, ...rest } = queryObject;

  const searchParams: AdminGetTransactionsParams = {
    limit: limit ? Number(limit) : pageSize,
    offset: offset ? Number(offset) : 0,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,

    ...rest,
  };

  return searchParams;
};
