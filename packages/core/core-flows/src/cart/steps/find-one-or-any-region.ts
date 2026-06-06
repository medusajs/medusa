import { MedusaContainer } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the region to find.
 */
export type FindOneOrAnyRegionStepInput = {
  /**
   * The ID of the region to find.
   */
  regionId?: string
}

async function fetchRegionById(regionId: string, container: MedusaContainer) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph(
    {
      entity: "region",
      filters: { id: regionId },
      fields: ["*", "countries.*"],
    },
    {
      cache: { enable: true },
    }
  )

  return data?.[0]
}

async function fetchDefaultStore(container: MedusaContainer) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph(
    {
      entity: "store",
      fields: ["*"],
    },
    {
      cache: { enable: true },
    }
  )

  return data?.[0]
}

async function fetchDefaultRegion(
  defaultRegionId: string,
  container: MedusaContainer
) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph(
    {
      entity: "region",
      filters: { id: defaultRegionId },
      fields: ["*", "countries.*"],
    },
    { cache: { enable: true } }
  )

  return data?.[0]
}

export const findOneOrAnyRegionStepId = "find-one-or-any-region"
/**
 * This step retrieves a region either by the provided ID or the first region in the first store.
 */
export const findOneOrAnyRegionStep = createStep(
  findOneOrAnyRegionStepId,
  async (data: FindOneOrAnyRegionStepInput, { container }) => {
    if (data.regionId) {
      try {
        const region = await fetchRegionById(data.regionId, container)
        return new StepResponse(region)
      } catch (error) {
        return new StepResponse(null)
      }
    }

    const store = await fetchDefaultStore(container)

    if (!store) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Store not found")
    }

    const region = await fetchDefaultRegion(store.default_region_id!, container)

    if (!region) {
      return new StepResponse(null)
    }

    return new StepResponse(region)
  }
)
