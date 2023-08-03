import { isDefined } from "medusa-core-utils"
import { MedusaError } from "@medusajs/utils"

import { CartInputAlias } from "../../definition"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

export async function attachRegionToCart<T>({
  container,
  context,
  data,
}: WorkflowArguments): Promise<PipelineHandlerResult<T>> {
  let regionId
  const regionService = container.resolve("regionService")

  if (isDefined(data[CartInputAlias.Cart].region_id)) {
    regionId = data[CartInputAlias.Cart].region_id
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

  data[CartInputAlias.Cart].region_id = regionId

  return data[CartInputAlias.Cart]
}
