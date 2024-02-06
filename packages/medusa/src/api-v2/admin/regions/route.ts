import { createRegionsWorkflow } from "@medusajs/core-flows"
import { CreateRegionDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { defaultAdminRegionFields } from "./query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = {
    filters: req.filterableFields,
    order: req.listConfig.order,
    skip: req.listConfig.skip,
    take: req.listConfig.take,
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "region",
    variables,
    fields: defaultAdminRegionFields,
  })

  const {
    rows: regions,
    metadata: { count },
  } = await remoteQuery(queryObject)

  res.json({
    count,
    regions,
    offset: req.listConfig.skip,
    limit: req.listConfig.take,
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const workflow = createRegionsWorkflow(req.scope)
  const input = [
    {
      ...(req.validatedBody as CreateRegionDTO),
    },
  ]

  const { result, errors } = await workflow.run({
    input: { regionsData: input },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ region: result[0] })
}
