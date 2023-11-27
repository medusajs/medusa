import {
  Context,
  CreateCurrencyDTO,
  DAL,
  UpdateCurrencyDTO,
} from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Currency } from "@models"

export class CurrencyRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<Currency> = { where: {} },
    context: Context = {}
  ): Promise<Currency[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      Currency,
      findOptions_.where as MikroFilterQuery<Currency>,
      findOptions_.options as MikroOptions<Currency>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<Currency> = { where: {} },
    context: Context = {}
  ): Promise<[Currency[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      Currency,
      findOptions_.where as MikroFilterQuery<Currency>,
      findOptions_.options as MikroOptions<Currency>
    )
  }

  async delete(codes: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(Currency, { code: { $in: codes } }, {})
  }

  async create(
    data: CreateCurrencyDTO[],
    context: Context = {}
  ): Promise<Currency[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const currencies = data.map((currencyData) => {
      return manager.create(Currency, currencyData)
    })

    manager.persist(currencies)

    return currencies
  }

  async update(
    data: UpdateCurrencyDTO[],
    context: Context = {}
  ): Promise<Currency[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const currencyCodes = data.map((currencyData) => currencyData.code)
    const existingCurrencies = await this.find(
      {
        where: {
          code: {
            $in: currencyCodes,
          },
        },
      },
      context
    )

    const existingCurrencyMap = new Map(
      existingCurrencies.map<[string, Currency]>((currency) => [
        currency.code,
        currency,
      ])
    )

    const currencies = data.map((currencyData) => {
      const existingCurrency = existingCurrencyMap.get(currencyData.code)

      if (!existingCurrency) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Currency with code "${currencyData.code}" not found`
        )
      }

      return manager.assign(existingCurrency, currencyData)
    })

    manager.persist(currencies)

    return currencies
  }
}
