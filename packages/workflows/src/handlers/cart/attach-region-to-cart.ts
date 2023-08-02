import { isDefined } from "medusa-core-utils"
import { MedusaError } from "@medusajs/utils"

import { InputAlias } from "../../definitions"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

export async function attachRegionToCart<T>({
  container,
  context,
  data,
}: WorkflowArguments): Promise<PipelineHandlerResult<T>> {
  let regionId
  const regionService = container.resolve("regionService")

  if (isDefined(data[InputAlias.Cart].region_id)) {
    regionId = data[InputAlias.Cart].region_id
  } else {
    const regions = await regionService.list({}, {})

    if (!regions?.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `A region is required to create a cart`
      )
    }

    regionId = regions[0].id
  }

  data[InputAlias.Cart].region_id = regionId

  return data[InputAlias.Cart]
}
