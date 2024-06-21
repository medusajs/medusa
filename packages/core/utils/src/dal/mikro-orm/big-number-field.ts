import { BigNumberInput } from "@medusajs/types"
import { Property } from "@mikro-orm/core"
import { isDefined, isPresent, trimZeros } from "../../common"
import { BigNumber } from "../../totals/big-number"

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

        return value || null
      },
      set(value: BigNumberInput) {
        const data: Record<string, any> = this.__helper?.__data || {}

        if (options?.nullable && !isPresent(value)) {
          data[columnName] = null
          data[rawColumnName]
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

          data[columnName] = bigNumber.numeric
          data[rawColumnName] = raw

          this[rawColumnName] = raw
        }

        if (!isDefined(this.__helper)) {
          return
        }

        this.__helper.__data = data

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
