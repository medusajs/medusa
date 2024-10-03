import {
  deleteSalesChannelsWorkflow,
  updateSalesChannelsWorkflow,
} from "@medusajs/core-flows"
import { MedusaError } from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { refetchSalesChannel } from "../helpers"
import {
  AdminGetSalesChannelParamsType,
  AdminUpdateSalesChannelType,
} from "../validators"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetSalesChannelParamsType>,
  res: MedusaResponse<HttpTypes.AdminSalesChannelResponse>
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
  res: MedusaResponse<HttpTypes.AdminSalesChannelResponse>
) => {
  const existingSalesChannel = await refetchSalesChannel(
    req.params.id,
    req.scope,
    ["id"]
  )

  if (!existingSalesChannel) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Sales channel with id "${req.params.id}" not found`
    )
  }

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
  res: MedusaResponse<HttpTypes.AdminSalesChannelDeleteResponse>
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
