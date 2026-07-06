import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  IStoreCreditModuleService,
  PluginModule,
  StoreStoreCreditAccount,
  StoreGetStoreCreditAccountsParams,
  StoreStoreCreditAccountsResponse,
} from "../../../types";

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreGetStoreCreditAccountsParams>,
  res: MedusaResponse<StoreStoreCreditAccountsResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const storeCreditModule = req.scope.resolve<IStoreCreditModuleService>(
    PluginModule.STORE_CREDIT
  );

  const { fields, pagination } = req.queryConfig;
  const { data: store_credit_accounts, metadata } = await query.graph({
    entity: "store_credit_account",
    fields,
    filters: {
      ...req.filterableFields,
      customer_id: req.auth_context.actor_id,
    },
    pagination: {
      ...pagination,
      skip: pagination.skip!,
    },
  });

  const finalStoreCreditAccounts: StoreStoreCreditAccount[] = [];

  for (const store_credit_account of store_credit_accounts) {
    const accountStats = await storeCreditModule.retrieveAccountStats({
      account_id: store_credit_account.id,
    });

    finalStoreCreditAccounts.push({
      ...store_credit_account,
      ...accountStats,
    });
  }

  res.json({
    store_credit_accounts: finalStoreCreditAccounts,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  });
};
