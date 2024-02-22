import { BigNumber } from "../../totals/big-number"
import { Property } from "@mikro-orm/core"
import { isDefined } from "../../common"
import { BigNumberInput } from "@medusajs/types"

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
        if (!isDefined(this[rawColumnName]) && !isDefined(this[targetColumn])) {
          return null
        }

        return this[targetColumn] instanceof BigNumber
          ? this[targetColumn].numeric
          : new BigNumber(this[rawColumnName] ?? this[targetColumn]).numeric
      },
      set(value: BigNumberInput) {
        const bigNumber =
          value instanceof BigNumber ? value : new BigNumber(value)
        this[targetColumn] = bigNumber.numeric
        this[rawColumnName] = bigNumber.raw
      },
    })

    Reflect.defineMetadata("design:type", "number", target, targetColumn)

    Property({
      columnType: "numeric",
      fieldName: columnName,
      ...options,
    })(target, targetColumn)

    Property({
      persist: false,
      getter: true,
    })(target, columnName)
  }
}
