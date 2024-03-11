import { BigNumberInput } from "@medusajs/types"
import { Property } from "@mikro-orm/core"
import { isPresent, trimZeros } from "../../common"
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
        return this.__helper.__data[columnName]
      },
      set(value: BigNumberInput) {
        if (options?.nullable && !isPresent(value)) {
          this.__helper.__data[columnName] = null
          this[rawColumnName] = null

          return
        }

        let bigNumber: BigNumber

        if (value instanceof BigNumber) {
          bigNumber = value
          this[rawColumnName].value = trimZeros(bigNumber.raw!.value as string)
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

        this.__helper.__data[columnName] = bigNumber.numeric

        const raw = bigNumber.raw!
        raw.value = trimZeros(raw.value as string)

        this[rawColumnName] = raw

        this.__helper.__touched = !this.__helper.hydrator.isRunning()
      },
    })

    Property({
      type: "number",
      columnType: "numeric",
      trackChanges: false,
      ...options,
    })(target, columnName)
  }
}
