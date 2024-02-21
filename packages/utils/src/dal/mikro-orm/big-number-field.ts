import { BigNumber } from "../../totals/big-number"

const bigNumberFields = new WeakMap<
  object,
  { prop: string; options: { nullable?: boolean } }[]
>()

export function BigNumberField(options: { nullable?: boolean } = {}) {
  return function (target: any, prop: string) {
    const entity = target.constructor
    if (!bigNumberFields.has(entity)) {
      bigNumberFields.set(entity, [])
    }

    if (prop.startsWith("raw_")) {
      const suggestedPropName = prop.replace("raw_", "")
      throw new Error(
        `BigNumberField decorator has to be used on the property "${suggestedPropName}" and ${prop} typed as BigNumberRawValue.`
      )
    }

    bigNumberFields.get(entity)?.push({ prop, options })

    if (!entity.prototype.__bigNumberInitialized) {
      entity.prototype.__bigNumberInitialized = true

      registerGlobalHook(entity)
    }
  }
}

function registerGlobalHook(entity: any) {
  const originalOnInit = entity.prototype.onInit
  const originalOnCreate = entity.prototype.onCreate
  const originalOnUpdate = entity.prototype.onUpdate

  entity.prototype.onInit = function (...args: any[]) {
    initializeBigNumberFields(this)

    if (originalOnInit) {
      originalOnInit.apply(this, args)
    }
  }

  entity.prototype.onCreate = function (...args: any[]) {
    initializeBigNumberFields(this)

    if (originalOnCreate) {
      originalOnCreate.apply(this, args)
    }
  }

  entity.prototype.onUpdate = function (...args: any[]) {
    initializeBigNumberFields(this)

    if (originalOnUpdate) {
      originalOnUpdate.apply(this, args)
    }
  }
}

function initializeBigNumberFields(entity: any) {
  const fields = bigNumberFields.get(entity.constructor) ?? []

  for (const field of fields) {
    const { prop, options } = field

    const rawValue = entity[`raw_${prop}`]
    const value = entity[prop]
    if (options.nullable && rawValue === null && value === null) {
      return
    }

    const val = new BigNumber(rawValue ?? value)
    entity[prop] = val.numeric
    entity[`raw_${prop}`] = val.raw
  }
}
