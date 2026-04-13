import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { IStoreCreditModuleService, PluginModule, StoreStoreCreditAccountResponse } from "../../../../types";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<StoreStoreCreditAccountResponse>
) => {
  const { id } = req.params;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const storeCreditModule = req.scope.resolve<IStoreCreditModuleService>(
    PluginModule.STORE_CREDIT
  );

  const {
    data: [store_credit_account],
  } = await query.graph(
    {
      entity: "store_credit_account",
      fields: req.queryConfig.fields,
      filters: {
        id,
        customer_id: req.auth_context.actor_id,
      },
    },
    { throwIfKeyNotFound: true }
  );

  // TODO: We should inject this into the module list and retrieve services
  // and allow scoping that through remote query
  const accountStats = await storeCreditModule.retrieveAccountStats({
    account_id: id,
  });

  res.json({
    store_credit_account: {
      ...store_credit_account,
      ...accountStats,
    },
  });
};
