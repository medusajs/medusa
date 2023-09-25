import { CreatePriceSetDTO } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceSet, PriceSetMoneyAmount } from "@models"
import { defaultPriceSetsData } from "./data"

type PriceSetPrice = {
  id: string
  context: {}
}

export async function createPriceForPriceSet(
  manager: SqlEntityManager,
  priceSetPrices: PriceSetPrice[]
): Promise<PriceSet[]> {
  const priceSets: PriceSet[] = []

  for (let priceSetPrice of priceSetPrices) {
    const priceSetPriceClone = { ...priceSetPrice }
    const priceSet = await manager.find(PriceSet, priceSetPriceClone.id)

    // const priceSetDataClone = { ...priceSetData }
    // const moneyAmountsData = priceSetDataClone.money_amounts || []
    // delete priceSetDataClone.money_amounts

    // let priceSet = manager.create(PriceSet, priceSetDataClone) as PriceSet

    // await manager.persist(priceSet).flush()

    // for (let moneyAmount of moneyAmountsData) {
    //   const price_set = (await manager.findOne(
    //     PriceSet,
    //     priceSet.id
    //   )) as PriceSet

    //   const psma = manager.create(PriceSetMoneyAmount, {
    //     price_set: price_set.id,
    //     money_amount: moneyAmount.id,
    //     title: "test",
    //   })

    //   manager.persist(psma).flush()
    // }
  }

  return priceSets
}

export async function createPriceSets(
  manager: SqlEntityManager,
  priceSetsData: CreatePriceSetDTO[] = defaultPriceSetsData
): Promise<PriceSet[]> {
  const priceSets: PriceSet[] = []

  for (let priceSetData of priceSetsData) {
    const priceSetDataClone = { ...priceSetData }
    const moneyAmountsData = priceSetDataClone.money_amounts || []
    delete priceSetDataClone.money_amounts

    let priceSet = manager.create(PriceSet, priceSetDataClone) as PriceSet

    await manager.persist(priceSet).flush()

    for (let moneyAmount of moneyAmountsData) {
      const price_set = (await manager.findOne(
        PriceSet,
        priceSet.id
      )) as PriceSet

      const psma = manager.create(PriceSetMoneyAmount, {
        price_set: price_set.id,
        money_amount: moneyAmount.id,
        title: "test",
      })

      manager.persist(psma).flush()
    }
  }

  return priceSets
}
