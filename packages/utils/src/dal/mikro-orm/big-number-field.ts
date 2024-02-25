import { BigNumberInput } from "@medusajs/types"
import { Property } from "@mikro-orm/core"
import { BigNumber } from "../../totals/big-number"

export function MikroOrmBigNumberProperty(
  options: Parameters<typeof Property>[0] & {
    rawColumnName?: string
  } = {}
) {
  return function (target: any, columnName: string) {
    const targetColumn = columnName + "_"
    const rawColumnName = options.rawColumnName ?? `raw_${columnName}`

    Object.defineProperty(target, columnName, {
      get() {
        return this[targetColumn]
      },
      set(value: BigNumberInput) {
        // if null or undefined
        if (options?.nullable && value == null) {
          this[targetColumn] = null
          this[rawColumnName] = null
          return
        }

        let bigNumber: BigNumber
        if (value instanceof BigNumber) {
          bigNumber = value
        } else if (this[rawColumnName]) {
          const precision = this[rawColumnName].precision
          this[rawColumnName].value = trimZeros(
            new BigNumber(value, {
              precision,
            }).raw!.value as string
          )
          bigNumber = new BigNumber(this[rawColumnName])
        } else {
          bigNumber = new BigNumber(value)
        }

        this[targetColumn] = bigNumber.numeric

        const raw = bigNumber.raw!
        raw.value = trimZeros(raw.value as string)

        this[rawColumnName] = raw
      },
    })

    Property({
      type: "number",
      columnType: "numeric",
      fieldName: columnName,
      serializer: () => {
        return undefined
      },
      ...options,
    })(target, targetColumn)

    Property({
      type: "number",
      persist: false,
      getter: true,
      setter: true,
    })(target, columnName)
  }
}

function trimZeros(value: string) {
  const [whole, fraction] = value.split(".")

  if (fraction) {
    const decimal = fraction.replace(/0+$/, "")
    if (!decimal) {
      return whole
    }

    return `${whole}.${decimal}`
  }

  return whole
}
