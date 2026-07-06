import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  StoreClaimStoreCreditAccountParams,
  StoreClaimStoreCreditAccountResponse,
} from "../../../../types";
import { claimStoreCreditAccountWorkflow } from "../../../../workflows/store-credit/workflows/claim-store-credit-account";

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreClaimStoreCreditAccountParams>,
  res: MedusaResponse<StoreClaimStoreCreditAccountResponse>
) => {
  const graph = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  await claimStoreCreditAccountWorkflow.run({
    input: {
      code: req.body.code,
      customer_id: req.auth_context.actor_id,
    },
    container: req.scope,
  });

  const storeCreditAccount = await graph.graph({
    entity: "store_credit_account",
    fields: ["id", "code", "customer_id", "currency_code", "balance"],
    filters: { code: req.body.code },
  });

  res.json({
    store_credit_account: storeCreditAccount.data[0],
  });
};
