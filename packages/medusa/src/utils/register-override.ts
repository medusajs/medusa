import { MedusaError } from "medusa-core-utils"

export type RegisterOverrides = Record<any, string[]>
type RegisterOverrideOptions = {
  key: string
  override: RegisterOverrides
}

export const registeredOverrides: Map<string, RegisterOverrides> = new Map()

export function registerOverride({ key, override }: RegisterOverrideOptions) {
  if (!key) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "`key` for registerOverride not found"
    )
  }

  registeredOverrides.set(key, override)
}

export function resetOverride(key?: string) {
  if (key) {
    registeredOverrides.delete(key)
  } else {
    registeredOverrides.clear()
  }
}
