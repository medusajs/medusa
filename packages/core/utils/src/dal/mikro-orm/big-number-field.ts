import { Property } from "@mikro-orm/core"
import { isPresent, trimZeros } from "../../common"
import { BigNumber } from "../../totals/big-number"
import { BigNumberInput } from "@medusajs/types"

export function MikroOrmBigNumberProperty(
  options: Parameters<typeof Property>[0] & {
    rawColumnName?: string
  } = {}
) {
  return function (target: any, columnName: string) {
    const rawColumnName = options.rawColumnName ?? `raw_${columnName}`

    Object.defineProperty(target, columnName, {
      get() {
        let value = this.__helper?.__data?.[columnName]

        if (!value && this[rawColumnName]) {
          value = new BigNumber(this[rawColumnName].value, {
            precision: this[rawColumnName].precision,
          }).numeric
        }

        return value
      },
      set(value: BigNumberInput) {
        if (options?.nullable && !isPresent(value)) {
          this.__helper.__data[columnName] = null
          this.__helper.__data[rawColumnName]
          this[rawColumnName] = null
        } else {
          let bigNumber: BigNumber

          if (value instanceof BigNumber) {
            bigNumber = value
          } else if (this[rawColumnName]) {
            const precision = this[rawColumnName].precision
            bigNumber = new BigNumber(value, {
              precision,
            })
          } else {
            bigNumber = new BigNumber(value)
          }

          const raw = bigNumber.raw!
          raw.value = trimZeros(raw.value as string)

          this.__helper.__data[columnName] = bigNumber.numeric
          this.__helper.__data[rawColumnName] = raw

          this[rawColumnName] = raw
        }

        // This is custom code to keep track of which fields are bignumber, as well as their data
        if (!this.__helper.__bignumberdata) {
          this.__helper.__bignumberdata = {}
        }

        this.__helper.__bignumberdata[columnName] =
          this.__helper.__data[columnName]
        this.__helper.__bignumberdata[rawColumnName] =
          this.__helper.__data[rawColumnName]
        this.__helper.__touched = !this.__helper.hydrator.isRunning()
      },
      enumerable: true,
      configurable: true,
    })

    Property({
      type: "any",
      columnType: "numeric",
      trackChanges: false,
      ...options,
    })(target, columnName)
  }
}
