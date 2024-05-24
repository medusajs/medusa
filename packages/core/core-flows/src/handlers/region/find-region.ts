import { RegionTypes } from "@medusajs/types"
import { isDefined, MedusaError } from "@medusajs/utils"

import { WorkflowArguments } from "@medusajs/workflows-sdk"

type RegionResultDTO = {
  region_id?: string
  //  TODO: Replace with RegionDTO from Region Module
  region?: RegionTypes.RegionDTO__legacy
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
}: WorkflowArguments<HandlerInputData>): Promise<RegionResultDTO> {
  const regionService = container.resolve("regionService")

  let regionId: string
  const regionDTO: RegionResultDTO = {}

  if (isDefined(data[Aliases.Region].region_id)) {
    regionDTO.region_id = data[Aliases.Region].region_id
    regionDTO.region = await regionService.retrieve(regionDTO.region_id, {
      relations: ["countries"],
    })
  } else {
    const regions = await regionService.list(
      {},
      {
        relations: ["countries"],
      }
    )

    if (!regions?.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `A region is required to create a cart`
      )
    }

    regionDTO.region_id = regions[0].id
    regionDTO.region = regions[0]
  }

  return regionDTO
}

findRegion.aliases = Aliases
