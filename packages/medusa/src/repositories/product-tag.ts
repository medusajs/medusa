import { EntityRepository, In, Repository } from "typeorm"
import { ProductTag } from "../models/product-tag"
import { ExtendedFindConfig } from "../types/common"

type UpsertTagsInput = (Partial<ProductTag> & {
  value: string
})[]

type ProductTagSelector = Partial<ProductTag> & {
  q?: string
  discount_condition_id?: string
}

export type DefaultWithoutRelations = Omit<
  ExtendedFindConfig<ProductTag, ProductTagSelector>,
  "relations"
>

export type FindWithoutRelationsOptions = DefaultWithoutRelations & {
  where: DefaultWithoutRelations["where"] & {
    discount_condition_id?: string
  }
}

@EntityRepository(ProductTag)
export class ProductTagRepository extends Repository<ProductTag> {
  public async listTagsByUsage(count = 10): Promise<ProductTag[]> {
    return await this.query(
      `
          SELECT id, COUNT(pts.product_tag_id) as usage_count, pt.value
          FROM product_tag pt
                   LEFT JOIN product_tags pts ON pt.id = pts.product_tag_id
          GROUP BY id
          ORDER BY usage_count DESC
              LIMIT $1
      `,
      [count]
    )
  }

  public async upsertTags(tags: UpsertTagsInput): Promise<ProductTag[]> {
    const tagsValues = tags.map((tag) => tag.value)
    const existingTags = await this.find({
      where: {
        value: In(tagsValues),
      },
    })
    const existingTagsMap = new Map(
      existingTags.map<[string, ProductTag]>((tag) => [tag.value, tag])
    )

    const upsertedTags: ProductTag[] = []

    for (const tag of tags) {
      const aTag = existingTagsMap.get(tag.value)
      if (aTag) {
        upsertedTags.push(aTag)
      } else {
        const newTag = this.create(tag)
        const savedTag = await this.save(newTag)
        upsertedTags.push(savedTag)
      }
    }

    return upsertedTags
  }

  async findAndCountByConditionId(
    conditionId: string,
    query: ExtendedFindConfig<ProductTag, Partial<ProductTag>>
  ) {
    const qb = this.createQueryBuilder("pt")

    if (query?.select) {
      qb.select(query.select.map((select) => `pt.${select}`))
    }

    if (query.skip) {
      qb.skip(query.skip)
    }

    if (query.take) {
      qb.take(query.take)
    }

    return await qb
      .where(query.where)
      .innerJoin(
        "discount_condition_product_tag",
        "dc_pt",
        `dc_pt.product_tag_id = pt.id AND dc_pt.condition_id = :dcId`,
        { dcId: conditionId }
      )
      .getManyAndCount()
  }

  /*public async findWithRelationsAndCount(
    relations: string[] = [],
    idsOrOptionsWithoutRelations: FindWithoutRelationsOptions = { where: {} }
  ): Promise<[ProductTag[], number]> {
    let count: number
    let entities: ProductTag[]
    if (Array.isArray(idsOrOptionsWithoutRelations)) {
      entities = await this.findByIds(idsOrOptionsWithoutRelations, {
        withDeleted: idsOrOptionsWithoutRelations.withDeleted ?? false,
      })
      count = entities.length
    } else {
      const result = await this.queryProductTags(
        idsOrOptionsWithoutRelations,
        true
      )
      entities = result[0]
      count = result[1]
    }
    const entitiesIds = entities.map(({ id }) => id)

    if (entitiesIds.length === 0) {
      // no need to continue
      return [[], count]
    }

    if (relations.length === 0) {
      const toReturn = await this.findByIds(
        entitiesIds,
        idsOrOptionsWithoutRelations
      )
      return [toReturn, toReturn.length]
    }

    const groupedRelations = this.getGroupedRelations(relations)
    const entitiesIdsWithRelations = await this.queryProductTagsWithIds(
      entitiesIds,
      groupedRelations,
      idsOrOptionsWithoutRelations.withDeleted,
      idsOrOptionsWithoutRelations.select
    )

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
    const entitiesToReturn =
      this.mergeEntitiesWithRelations(entitiesAndRelations)

    return [entitiesToReturn, count]
  }

  private getGroupedRelations(relations: string[]): {
    [toplevel: string]: string[]
  } {
    const groupedRelations: { [toplevel: string]: string[] } = {}
    for (const rel of relations) {
      const [topLevel] = rel.split(".")
      if (groupedRelations[topLevel]) {
        groupedRelations[topLevel].push(rel)
      } else {
        groupedRelations[topLevel] = [rel]
      }
    }

    return groupedRelations
  }

  private async queryProductTags(
    optionsWithoutRelations: FindWithoutRelationsOptions,
    shouldCount = false
  ): Promise<[ProductTag[], number]> {
    const options = { ...optionsWithoutRelations }
    const discountConditionId = options?.where?.discount_condition_id
    delete options?.where?.discount_condition_id

    const productTagAlias = "product_tag"

    const qb = this.createQueryBuilder(productTagAlias)
      .select([`${productTagAlias}.id`])
      .skip(optionsWithoutRelations.skip)
      .take(optionsWithoutRelations.take)

    if (optionsWithoutRelations.where) {
      qb.where(optionsWithoutRelations.where)
    }

    if (optionsWithoutRelations.order) {
      const toSelect: string[] = []
      const parsed = Object.entries(optionsWithoutRelations.order).reduce(
        (acc, [k, v]) => {
          const key = `${productTagAlias}.${k}`
          toSelect.push(key)
          acc[key] = v
          return acc
        },
        {}
      )
      qb.addSelect(toSelect)
      qb.orderBy(parsed)
    }

    if (discountConditionId) {
      qb.innerJoin("discount-condition", "dc", `dc.id = :dcId`, {
        dcId: discountConditionId,
      }).innerJoin(
        "discount-condition-tag",
        "dc_tag",
        `dc_tag.condition_id = dc.id AND dc_tag.product_tag_id = ${productTagAlias}.id`
      )
    }

    if (optionsWithoutRelations.withDeleted) {
      qb.withDeleted()
    }

    let entities: ProductTag[]
    let count = 0
    if (shouldCount) {
      const result = await qb.getManyAndCount()
      entities = result[0]
      count = result[1]
    } else {
      entities = await qb.getMany()
    }

    return [entities, count]
  }

  private async queryProductTagsWithIds(
    entityIds: string[],
    groupedRelations: { [toplevel: string]: string[] },
    withDeleted = false,
    select: (keyof ProductTag)[] = []
  ): Promise<ProductTag[]> {
    const productTagAlias = "product_tag"

    const entitiesIdsWithRelations = await Promise.all(
      Object.entries(groupedRelations).map(async ([toplevel, rels]) => {
        let querybuilder = this.createQueryBuilder(`${productTagAlias}`)

        if (select && select.length) {
          querybuilder.select(select.map((f) => `${productTagAlias}.${f}`))
        }

        querybuilder = querybuilder.leftJoinAndSelect(
          `${productTagAlias}.${toplevel}`,
          toplevel
        )

        for (const rel of rels) {
          const [_, rest] = rel.split(".")
          if (!rest) {
            continue
          }
          // Regex matches all '.' except the rightmost
          querybuilder = querybuilder.leftJoinAndSelect(
            rel.replace(/\.(?=[^.]*\.)/g, "__"),
            rel.replace(".", "__")
          )
        }

        if (withDeleted) {
          querybuilder = querybuilder
            .where(`${productTagAlias}.id IN (:...entitiesIds)`, {
              entitiesIds: entityIds,
            })
            .withDeleted()
        } else {
          querybuilder = querybuilder.where(
            `${productTagAlias}.deleted_at IS NULL AND ${productTagAlias}.id IN (:...entitiesIds)`,
            {
              entitiesIds: entityIds,
            }
          )
        }

        return querybuilder.getMany()
      })
    ).then(flatten)

    return entitiesIdsWithRelations
  }

  private mergeEntitiesWithRelations(
    entitiesAndRelations: Array<Partial<Product>>
  ): ProductTag[] {
    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
    return map(entitiesAndRelationsById, (entityAndRelations) =>
      merge({}, ...entityAndRelations)
    )
  }*/
}
