import { HttpTypes } from "@medusajs/types";
import { useQueryParams } from "../../hooks/common/use-query-params";

type UseGiftCardProductsTableQueryProps = {
  prefix?: string;
  pageSize?: number;
};

const DEFAULT_FIELDS =
  "id,title,handle,status,*sales_channels,variants.id,thumbnail";

export const useGiftCardProductsTableQuery = ({
  prefix,
  pageSize = 20,
}: UseGiftCardProductsTableQueryProps) => {
  const queryObject = useQueryParams(
    [
      "offset",
      "order",
      "q",
      "created_at",
      "updated_at",
      "sales_channel_id",
      "status",
      "id",
    ],
    prefix
  );

  const { offset, sales_channel_id, created_at, updated_at, status, order, q } =
    queryObject;

  const searchParams: HttpTypes.AdminProductListParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sales_channel_id: sales_channel_id?.split(","),
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    order: order,
    status: status?.split(",") as HttpTypes.AdminProductStatus[],
    q,
    fields: DEFAULT_FIELDS,
  };

  return {
    searchParams,
    raw: queryObject,
  };
};
