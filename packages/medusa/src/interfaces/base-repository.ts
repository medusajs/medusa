import { EntityTarget } from "typeorm/common/EntityTarget"
import { MedusaError } from "medusa-core-utils"
import { ClassConstructor } from "../types/global"
import { Repository } from "typeorm"

export abstract class BaseRepository<TEntity> extends Repository<TEntity> {
  public async validateAllItemExistsOrThrow<Entity>(
    entity: EntityTarget<Entity & { id: string }>,
    itemIds: string[]
  ): Promise<void | never> {
    const existingItems = await this.manager.findByIds(entity, itemIds)

    const nonExistingItems = itemIds.filter(
      (cId) => existingItems.findIndex((el) => el.id === cId) === -1
    )

    const formattedEntityName = (entity as ClassConstructor<Entity>).name
      .split(/(?=[A-Z])/)
      .map((v) => v.toLowerCase())
      .join(" ")

    if (nonExistingItems.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `The following ${formattedEntityName}s ids do not exist: ${nonExistingItems.join(
          ", "
        )}`
      )
    }
  }
}
