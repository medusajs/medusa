import { MedusaContainer, RemoteQueryFunction } from "@medusajs/types"
import { ContainerRegistrationKeys } from "../common/container"
import { isObject } from "../common/is-object"
import { FeatureFlag } from "../feature-flags/flag-router"

const excludedKeys = [
  "id",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

function canApplyTranslationTo(object: Record<string, any>) {
  return isObject(object) && "id" in object && !!object.id
}

function gatherIds(object: Record<string, any>, gatheredIds: Set<string>) {
  if (!isObject(object)) {
    return
  }

  if (object.id) {
    gatheredIds.add(object.id)
  }

  Object.entries(object).forEach(([, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => item && gatherIds(item, gatheredIds))
    } else if (isObject(value)) {
      gatherIds(value, gatheredIds)
    }
  })
}

function applyTranslation(
  object: Record<string, any>,
  entityIdToTranslation: Map<string, Record<string, any>>
) {
  const translation = entityIdToTranslation.get(object.id)
  const hasTranslation = !!translation

  Object.entries(object).forEach(([key, value]) => {
    if (excludedKeys.includes(key)) {
      return
    }

    if (hasTranslation) {
      if (
        key in translation &&
        typeof object[key] === typeof translation[key]
      ) {
        object[key] = translation[key]
        return
      }
    }

    if (Array.isArray(value)) {
      value.forEach(
        (item) =>
          item &&
          canApplyTranslationTo(item) &&
          applyTranslation(item, entityIdToTranslation)
      )
    } else if (isObject(value) && canApplyTranslationTo(value)) {
      applyTranslation(value, entityIdToTranslation)
    }
  })
}

export async function applyTranslations({
  localeCode,
  objects,
  container,
}: {
  localeCode: string | undefined
  objects: Record<string, any>[]
  container: MedusaContainer
}) {
  const isTranslationEnabled = FeatureFlag.isFeatureEnabled("translation")

  if (!isTranslationEnabled) {
    return
  }

  const locale = localeCode

  if (!locale) {
    return
  }

  const objects_ = objects.filter((o) => !!o)
  if (!objects_.length) {
    return
  }

  const gatheredIds: Set<string> = new Set()

  for (const inputObject of objects_) {
    gatherIds(inputObject, gatheredIds)
  }

  const query = container.resolve<RemoteQueryFunction>(
    ContainerRegistrationKeys.QUERY
  )

  const queryBatchSize = 250
  const queryBatches = Math.ceil(gatheredIds.size / queryBatchSize)

  const entityIdToTranslation = new Map<string, Record<string, any>>()

  for (let i = 0; i < queryBatches; i++) {
    // TODO: concurrently fetch if needed
    const queryBatch = Array.from(gatheredIds)
      .slice(i * queryBatchSize, (i + 1) * queryBatchSize)
      .sort()

    const { data: translations } = await query.graph(
      {
        entity: "translations",
        fields: ["translations", "reference_id"],
        filters: {
          reference_id: queryBatch,
          locale_code: locale,
        },
        pagination: {
          take: queryBatchSize,
        },
      },
      {
        cache: { enable: true },
      }
    )

    for (const translation of translations) {
      entityIdToTranslation.set(
        translation.reference_id,
        translation.translations ?? {}
      )
    }
  }

  for (const inputObject of objects_) {
    applyTranslation(inputObject, entityIdToTranslation)
  }
}
