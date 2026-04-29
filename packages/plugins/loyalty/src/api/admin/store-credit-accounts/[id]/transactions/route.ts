import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { AdminGetTransactionsParams, AdminTransactionsResponse } from "../../../../../types";

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetTransactionsParams>,
  res: MedusaResponse<AdminTransactionsResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { id } = req.params;
  const { fields, pagination } = req.queryConfig;

  const { data: transactions, metadata } = await query.graph({
    entity: "account_transaction",
    fields,
    filters: { account_id: id, ...req.filterableFields },
    pagination,
  });

  res.json({
    transactions,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  });
};
