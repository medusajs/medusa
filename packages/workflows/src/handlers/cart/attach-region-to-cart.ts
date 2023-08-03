import { isDefined } from "medusa-core-utils"
import { MedusaError } from "@medusajs/utils"

import { CartInputAlias } from "../../definition"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

type AttachRegionDTO = {
  region_id?: string
}

export async function attachRegionToCart({
  container,
  context,
  data,
}: WorkflowArguments): Promise<AttachRegionDTO> {
  let regionId
  const regionDTO: AttachRegionDTO = {}
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

  regionDTO.region_id = regionId

  return regionDTO
}
