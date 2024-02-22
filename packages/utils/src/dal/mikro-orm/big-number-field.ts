import { BigNumber } from "../../totals/big-number"
import { Property } from "@mikro-orm/core"
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
        return this[targetColumn]
      },
      set(value: BigNumberInput) {
        let bigNumber: BigNumber
        if (value instanceof BigNumber) {
          bigNumber = value
        } else if (this[rawColumnName]) {
          const precision = this[rawColumnName].precision
          this[rawColumnName].value = new BigNumber(value, {
            precision,
          }).raw!.value
          bigNumber = new BigNumber(this[rawColumnName])
        } else {
          bigNumber = new BigNumber(value)
        }

        this[targetColumn] = bigNumber.numeric
        this[rawColumnName] = bigNumber.raw
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
