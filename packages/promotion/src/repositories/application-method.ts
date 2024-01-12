import { DALUtils } from "@medusajs/utils"
import { ApplicationMethod } from "@models"
import { CreateApplicationMethodDTO, UpdateApplicationMethodDTO } from "@types"

export class ApplicationMethodRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  ApplicationMethod,
  {
    create: CreateApplicationMethodDTO
    update: UpdateApplicationMethodDTO
  }
>(ApplicationMethod) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
