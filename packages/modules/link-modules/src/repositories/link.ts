import { Context, ModuleJoinerConfig } from "@zjedene-medusa/framework/types"
import { EntitySchema } from "@zjedene-medusa/framework/mikro-orm/core"

import {
  generateEntityId,
  mikroOrmBaseRepositoryFactory,
} from "@zjedene-medusa/framework/utils"
import { SqlEntityManager } from "@zjedene-medusa/framework/mikro-orm/postgresql"

export function getLinkRepository(model: EntitySchema) {
  return class LinkRepository extends mikroOrmBaseRepositoryFactory(model) {
    readonly joinerConfig_: ModuleJoinerConfig

    constructor({ joinerConfig }: { joinerConfig: ModuleJoinerConfig }) {
      // @ts-ignore
      super(...arguments)
      this.joinerConfig_ = joinerConfig
    }

    async delete(data: any, context: Context = {}): Promise<string[]> {
      const filter = {}
      for (const key in data) {
        filter[key] = {
          $in: Array.isArray(data[key]) ? data[key] : [data[key]],
        }
      }

      return await super.delete(filter, context)
    }

    async create(data: object[], context: Context = {}): Promise<object[]> {
      const manager = this.getActiveManager<SqlEntityManager>(context)

      const links = data.map((link: any) => {
        link.id = generateEntityId(
          link.id,
          this.joinerConfig_.databaseConfig?.idPrefix ?? "link"
        )
        link.deleted_at = null
        return manager.create(model, link)
      })

      await manager.upsertMany(model, links)

      return links
    }
  }
}
