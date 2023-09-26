import {
  Context,
  CreatePriceSetMoneyAmountDTO,
  DAL,
  UpdatePriceSetMoneyAmountDTO,
} from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceSetMoneyAmount } from "@models"

export class PriceSetMoneyAmountRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<PriceSetMoneyAmount> = { where: {} },
    context: Context = {}
  ): Promise<PriceSetMoneyAmount[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      PriceSetMoneyAmount,
      findOptions_.where as MikroFilterQuery<PriceSetMoneyAmount>,
      findOptions_.options as MikroOptions<PriceSetMoneyAmount>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<PriceSetMoneyAmount> = { where: {} },
    context: Context = {}
  ): Promise<[PriceSetMoneyAmount[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      PriceSetMoneyAmount,
      findOptions_.where as MikroFilterQuery<PriceSetMoneyAmount>,
      findOptions_.options as MikroOptions<PriceSetMoneyAmount>
    )
  }

  async delete(codes: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(PriceSetMoneyAmount, { id: { $in: codes } }, {})
  }

  async create(
    data: CreatePriceSetMoneyAmountDTO[],
    context: Context = {}
  ): Promise<PriceSetMoneyAmount[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const currencies = data.map((currencyData) => {
      return manager.create(PriceSetMoneyAmount, currencyData as PriceSetMoneyAmount)
    })

    manager.persist(currencies)

    return currencies
  }

  async update(
    data: UpdatePriceSetMoneyAmountDTO[],
    context: Context = {}
  ): Promise<PriceSetMoneyAmount[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const currencyCodes = data.map((currencyData) => currencyData.id)
    const existingCurrencies = await this.find(
      {
        where: {
          id: {
            $in: currencyCodes,
          },
        },
      },
      context
    )

    const existingCurrencyMap = new Map(
      existingCurrencies.map<[string, PriceSetMoneyAmount]>((currency) => [
        currency.id,
        currency,
      ])
    )

    const currencies = data.map((currencyData) => {
      const existingCurrency = existingCurrencyMap.get(currencyData.id)

      if (!existingCurrency) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `PriceSetMoneyAmount with id "${currencyData.id}" not found`
        )
      }

      return manager.assign(existingCurrency, currencyData)
    })

    manager.persist(currencies)

    return currencies
  }
}
