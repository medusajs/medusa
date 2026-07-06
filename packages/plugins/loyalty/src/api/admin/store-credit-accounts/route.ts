import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  AdminCreateStoreCreditAccount,
  AdminGetStoreCreditAccountsParams,
  AdminStoreCreditAccount,
  AdminStoreCreditAccountResponse,
  AdminStoreCreditAccountsResponse,
  IStoreCreditModuleService,
  PluginModule,
} from "../../../types";
import { createStoreCreditAccountsWorkflow } from "../../../workflows/store-credit/workflows/create-store-credit-accounts";

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetStoreCreditAccountsParams>,
  res: MedusaResponse<AdminStoreCreditAccountsResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const storeCreditModule = req.scope.resolve<IStoreCreditModuleService>(
    PluginModule.STORE_CREDIT
  );

  const { fields, pagination } = req.queryConfig;
  const { data: accounts, metadata } = await query.graph({
    entity: "store_credit_account",
    fields,
    filters: { ...req.filterableFields },
    pagination: {
      ...pagination,
      skip: pagination.skip!,
    },
  });

  const finalStoreCreditAccounts: AdminStoreCreditAccount[] = [];

  for (const store_credit_account of accounts) {
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

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateStoreCreditAccount>,
  res: MedusaResponse<AdminStoreCreditAccountResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    result: [storeCreditAccount],
  } = await createStoreCreditAccountsWorkflow.run({
    input: [{ ...req.validatedBody }],
    container: req.scope,
  });

  const {
    data: [store_credit_account],
  } = await query.graph(
    {
      entity: "store_credit_accounts",
      fields: req.queryConfig.fields,
      filters: { id: storeCreditAccount.id },
    },
    { throwIfKeyNotFound: true }
  );

  res.json({ store_credit_account });
};
