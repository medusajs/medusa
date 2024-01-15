import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Address } from "@models"
import { CreateAddressDTO, UpdateAddressDTO } from "../types"

export class AddressRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Address,
  {
    create: CreateAddressDTO
  }
>(Address) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }

  async update(
    data: { address: Address; update: UpdateAddressDTO }[],
    context: Context = {}
  ): Promise<Address[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const entities = data.map(({ address, update }) => {
      return manager.assign(address, update)
    })

    manager.persist(entities)

    return entities
  }
}
