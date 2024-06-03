import {
  deleteSalesChannelsWorkflow,
  updateSalesChannelsWorkflow,
} from "@medusajs/core-flows"
import { MedusaError } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchSalesChannel } from "../helpers"
import {
  AdminGetSalesChannelParamsType,
  AdminUpdateSalesChannelType,
} from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetSalesChannelParamsType>,
  res: MedusaResponse
) => {
  const salesChannel = await refetchSalesChannel(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!salesChannel) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Sales channel with id: ${req.params.id} not found`
    )
  }

  res.json({ sales_channel: salesChannel })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateSalesChannelType>,
  res: MedusaResponse
) => {
  await updateSalesChannelsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const salesChannel = await refetchSalesChannel(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ sales_channel: salesChannel })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  await deleteSalesChannelsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "sales-channel",
    deleted: true,
  })
}
