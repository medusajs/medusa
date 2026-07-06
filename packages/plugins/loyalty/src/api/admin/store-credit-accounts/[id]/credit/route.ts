import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import {
  AdminCreditStoreCreditAccountParams,
  AdminGetStoreCreditAccountsParams,
  AdminStoreCreditAccountResponse,
} from "../../../../../types";
import { creditStoreCreditAccountWorkflow } from "../../../../../workflows/store-credit/workflows/credit-store-credit-account";

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreditStoreCreditAccountParams>,
  res: MedusaResponse<AdminStoreCreditAccountResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { id } = req.params;

  const filters: AdminGetStoreCreditAccountsParams = {
    id,
  };

  await creditStoreCreditAccountWorkflow.run({
    input: {
      account_id: id,
      amount: req.validatedBody.amount,
      note: req.validatedBody.note,
      reference: req.auth_context.actor_type,
      reference_id: req.auth_context.actor_id,
    },
    container: req.scope,
  });

  const {
    data: [store_credit_account],
  } = await query.graph(
    {
      entity: "store_credit_account",
      fields: req.queryConfig.fields,
      filters,
    },
    { throwIfKeyNotFound: true }
  );

  res.json({ store_credit_account });
};
