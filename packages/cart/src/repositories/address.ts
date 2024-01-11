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
  async update(
    data: { address: Address; update: UpdateAddressDTO }[],
    context: Context = {}
  ): Promise<Address[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const entities = data.map(({ address, update }) => {
      return manager.assign(address, update)
    })

    return await super.update(entities, context)
  }
}
