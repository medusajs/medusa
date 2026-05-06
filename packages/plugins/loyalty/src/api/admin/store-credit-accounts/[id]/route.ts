import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  AdminGetStoreCreditAccountsParams,
  AdminStoreCreditAccountResponse,
} from "../../../../types";

export const GET = async (
  req: AuthenticatedMedusaRequest<null, AdminGetStoreCreditAccountsParams>,
  res: MedusaResponse<AdminStoreCreditAccountResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { id } = req.params;

  const filters: AdminGetStoreCreditAccountsParams = {
    id,
  };

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
