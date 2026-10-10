import type { HttpTypes } from "@medusajs/types"
import type {
  EntityTranslationsSchemaType,
  TranslationsFormSchema,
} from "./translations-edit-form"

export type LocaleSnapshot = {
  localeCode: string
  entities: Record<string, EntityTranslationsSchemaType>
}

export type TranslationReference = {
  id: string
  [key: string]: unknown
}

export function buildLocaleSnapshot(
  translations: HttpTypes.AdminTranslation[],
  references: TranslationReference[],
  localeCode: string,
  translatableFields: string[]
): LocaleSnapshot {
  const referenceTranslations = new Map<string, HttpTypes.AdminTranslation>()
  for (const t of translations) {
    if (t.locale_code === localeCode) {
      referenceTranslations.set(t.reference_id, t)
    }
  }

  const entities: Record<string, EntityTranslationsSchemaType> = {}
  for (const ref of references) {
    const existing = referenceTranslations.get(ref.id)
    const fields: Record<string, string> = {}

    for (const fieldName of translatableFields) {
      fields[fieldName] = (existing?.translations?.[fieldName] as string) ?? ""
    }

    entities[ref.id] = {
      id: existing?.id ?? null,
      fields,
    }
  }

  return { localeCode, entities }
}

export function extendSnapshot(
  snapshot: LocaleSnapshot,
  translations: HttpTypes.AdminTranslation[],
  newReferences: TranslationReference[],
  translatableFields: string[]
): LocaleSnapshot {
  const referenceTranslations = new Map<string, HttpTypes.AdminTranslation>()
  for (const t of translations) {
    if (t.locale_code === snapshot.localeCode) {
      referenceTranslations.set(t.reference_id, t)
    }
  }

  const extendedEntities = { ...snapshot.entities }

  for (const ref of newReferences) {
    if (!extendedEntities[ref.id]) {
      const existing = referenceTranslations.get(ref.id)
      const fields: Record<string, string> = {}

      for (const fieldName of translatableFields) {
        fields[fieldName] =
          (existing?.translations?.[fieldName] as string) ?? ""
      }

      extendedEntities[ref.id] = {
        id: existing?.id ?? null,
        fields,
      }
    }
  }

  return { ...snapshot, entities: extendedEntities }
}

export function snapshotToFormValues(
  snapshot: LocaleSnapshot
): TranslationsFormSchema {
  return { entities: structuredClone(snapshot.entities) }
}

/** Copy only matching fields; never replace IDs or unrelated translations. */
export function copyTranslationField(
  values: TranslationsFormSchema,
  fieldName: string,
  value: string,
  onlyEmpty: boolean
) {
  const changes: { referenceId: string; before: string; after: string }[] = []
  for (const [referenceId, entity] of Object.entries(values.entities)) {
    if (!Object.prototype.hasOwnProperty.call(entity.fields, fieldName)) {
      continue
    }
    const before = entity.fields[fieldName] ?? ""
    if (before === value || (onlyEmpty && before.trim() !== "")) {
      continue
    }
    changes.push({ referenceId, before, after: value })
  }
  return changes
}

type ChangeDetectionResult = {
  hasChanges: boolean
  payload: Required<HttpTypes.AdminBatchTranslations>
}

export function computeChanges(
  currentState: TranslationsFormSchema,
  snapshot: LocaleSnapshot,
  entityType: string,
  localeCode: string
): ChangeDetectionResult {
  const payload: Required<HttpTypes.AdminBatchTranslations> = {
    create: [],
    update: [],
    delete: [],
  }

  for (const [entityId, _entityData] of Object.entries(currentState.entities)) {
    const entityData = _entityData as EntityTranslationsSchemaType
    const baseline = snapshot.entities[entityId]
    if (!baseline) {
      continue
    }

    const hasContent = Object.values(entityData.fields).some(
      (v) => v !== undefined && v.trim() !== ""
    )
    const hadContent = Object.values(baseline.fields).some(
      (v) => v !== undefined && v.trim() !== ""
    )
    const hasChanged =
      JSON.stringify(entityData.fields) !== JSON.stringify(baseline.fields)

    if (!entityData.id && hasContent) {
      payload.create.push({
        reference_id: entityId,
        reference: entityType,
        locale_code: localeCode,
        translations: entityData.fields as Record<string, string>,
      })
    } else if (entityData.id && hasContent && hasChanged) {
      payload.update.push({
        id: entityData.id,
        translations: entityData.fields as Record<string, string>,
      })
    } else if (entityData.id && !hasContent && hadContent) {
      payload.delete.push(entityData.id)
    }
  }

  const hasChanges =
    payload.create.length > 0 ||
    payload.update.length > 0 ||
    payload.delete.length > 0

  return { hasChanges, payload }
}
