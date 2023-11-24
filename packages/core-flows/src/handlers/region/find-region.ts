import { MedusaError } from "@medusajs/utils"
import { isDefined } from "medusa-core-utils"

import { WorkflowArguments } from "@medusajs/workflows-sdk"

type RegionDTO = {
  region_id?: string
}

type HandlerInputData = {
  region: {
    region_id: string
  }
}

enum Aliases {
  Region = "region",
}

export async function findRegion({
  container,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<RegionDTO> {
  const regionService = container.resolve("regionService")

  let regionId: string
  const regionDTO: RegionDTO = {}

  if (isDefined(data[Aliases.Region].region_id)) {
    regionId = data[Aliases.Region].region_id
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

findRegion.aliases = Aliases
