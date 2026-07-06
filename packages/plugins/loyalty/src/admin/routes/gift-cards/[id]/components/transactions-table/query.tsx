import { AdminGetTransactionsParams } from "../../../../../../types";
import { useQueryParams } from "../../../../../hooks/common/use-query-params";

type UseTransactionTableQueryProps = {
  prefix?: string;
  pageSize?: number;
};

export const useTransactionTableQuery = ({
  prefix,
  pageSize = 10,
}: UseTransactionTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "created_at", "updated_at"],
    prefix
  );

  const { offset, created_at, updated_at, ...rest } = queryObject;

  const searchParams: AdminGetTransactionsParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,

    ...rest,
  };

  return searchParams;
};
