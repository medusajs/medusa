import {flatten, groupBy, map, merge} from "lodash"
import {Brackets, EntityRepository, Repository} from "typeorm"
import {ProductReview} from "../models/product-review"
import {
    ExtendedFindConfig,
    Selector, WithRequiredProperty,
} from "@medusajs/medusa/dist/types/common"

export type ProductReviewSelector = Omit<Selector<ProductReview>, "tags">

export type DefaultWithoutRelations = Omit<ExtendedFindConfig<ProductReview, ProductReviewSelector>,
    "relations">

export type FindWithoutRelationsOptions = DefaultWithoutRelations & {
    where: DefaultWithoutRelations["where"]
}

@EntityRepository(ProductReview)
export class ProductReviewRepository extends Repository<ProductReview> {
    private static getGroupedRelations(relations: string[]): {
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

    public async findWithRelationsAndCount(
        relations: string[] = [],
        idsOrOptionsWithoutRelations: FindWithoutRelationsOptions = {where: {}}
    ): Promise<[ProductReview[], number]> {
        let count: number
        let entities: ProductReview[]
        if (Array.isArray(idsOrOptionsWithoutRelations)) {
            entities = await this.findByIds(idsOrOptionsWithoutRelations, {
                withDeleted: idsOrOptionsWithoutRelations.withDeleted ?? false,
            })
            count = entities.length
        } else {
            const result = await this.queryProductReviews(
                idsOrOptionsWithoutRelations,
                true
            )
            entities = result[0]
            count = result[1]
        }
        const entitiesIds = entities.map(({id}) => id)

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

        const groupedRelations =
            ProductReviewRepository.getGroupedRelations(relations)
        const entitiesIdsWithRelations = await this.queryProductReviewsWithIds(
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

    public async findWithRelations(
        relations: string[] = [],
        idsOrOptionsWithoutRelations: FindWithoutRelationsOptions | string[] = {
            where: {},
        },
        withDeleted = false
    ): Promise<ProductReview[]> {
        let entities: ProductReview[]
        if (Array.isArray(idsOrOptionsWithoutRelations)) {
            entities = await this.findByIds(idsOrOptionsWithoutRelations, {
                withDeleted,
            })
        } else {
            const result = await this.queryProductReviews(
                idsOrOptionsWithoutRelations,
                false
            )
            entities = result[0]
        }
        const entitiesIds = entities.map(({id}) => id)

        if (entitiesIds.length === 0) {
            // no need to continue
            return []
        }

        if (
            relations.length === 0 &&
            !Array.isArray(idsOrOptionsWithoutRelations)
        ) {
            return await this.findByIds(entitiesIds, idsOrOptionsWithoutRelations)
        }

        const groupedRelations =
            ProductReviewRepository.getGroupedRelations(relations)
        const entitiesIdsWithRelations = await this.queryProductReviewsWithIds(
            entitiesIds,
            groupedRelations,
            withDeleted
        )

        const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
        return this.mergeEntitiesWithRelations(entitiesAndRelations)
    }

    public async findOneWithRelations(
        relations: string[] = [],
        optionsWithoutRelations: FindWithoutRelationsOptions = {where: {}}
    ): Promise<ProductReview> {
        // Limit 1
        optionsWithoutRelations.take = 1

        const result = await this.findWithRelations(
            relations,
            optionsWithoutRelations
        )
        return result[0]
    }

    public async getFreeTextSearchResultsAndCount(
        q: string,
        options: FindWithoutRelationsOptions = {where: {}},
        relations: string[] = []
    ): Promise<[ProductReview[], number]> {
        const cleanedOptions = this._cleanOptions(options)

        let qb = this.createQueryBuilder("product_review")
            .select(["product_review.id"])
            .where(cleanedOptions.where)
            .andWhere(
                new Brackets((qb) => {
                    qb.where(`product_review.product_id ILIKE :q`, {
                        q: `%${q}%`,
                    }).orWhere(`product_review.email ILIKE :q`, {q: `%${q}%`})
                })
            )
            .skip(cleanedOptions.skip)
            .take(cleanedOptions.take)

        if (cleanedOptions.withDeleted) {
            qb = qb.withDeleted()
        }

        const [results, count] = await qb.getManyAndCount()

        const products = await this.findWithRelations(
            relations,
            results.map((r) => r.id),
            cleanedOptions.withDeleted
        )

        return [products, count]
    }

    private mergeEntitiesWithRelations(
        entitiesAndRelations: Array<Partial<ProductReview>>
    ): ProductReview[] {
        const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
        return map(entitiesAndRelationsById, (entityAndRelations) =>
            merge({}, ...entityAndRelations)
        )
    }

    private async queryProductReviews(
        optionsWithoutRelations: FindWithoutRelationsOptions,
        shouldCount = false
    ): Promise<[ProductReview[], number]> {
        const qb = this.createQueryBuilder("product_review")
            .select(["product_review.id"])
            .skip(optionsWithoutRelations.skip)
            .take(optionsWithoutRelations.take)

        if (optionsWithoutRelations.where) {
            qb.where(optionsWithoutRelations.where)
        }

        if (optionsWithoutRelations.order) {
            const toSelect: string[] = []
            const parsed = Object.entries(optionsWithoutRelations.order).reduce(
                (acc, [k, v]) => {
                    const key = `product_review.${k}`
                    toSelect.push(key)
                    acc[key] = v
                    return acc
                },
                {}
            )
            qb.addSelect(toSelect)
            qb.orderBy(parsed)
        }

        if (optionsWithoutRelations.withDeleted) {
            qb.withDeleted()
        }

        let entities: ProductReview[]
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

    private async queryProductReviewsWithIds(
        entityIds: string[],
        groupedRelations: { [toplevel: string]: string[] },
        withDeleted = false,
        select: (keyof ProductReview)[] = []
    ): Promise<ProductReview[]> {
        return await Promise.all(
            Object.entries(groupedRelations).map(([toplevel, rels]) => {
                let querybuilder = this.createQueryBuilder("product_review")

                if (select && select.length) {
                    querybuilder.select(select.map((f) => `product_review.${f}`))
                }

                querybuilder = querybuilder.leftJoinAndSelect(
                    `product_review.${toplevel}`,
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
                        .where("product_review.id IN (:...entitiesIds)", {
                            entitiesIds: entityIds,
                        })
                        .withDeleted()
                } else {
                    querybuilder = querybuilder.where(
                        "product_review.deleted_at IS NULL AND product_review.id IN (:...entitiesIds)",
                        {
                            entitiesIds: entityIds,
                        }
                    )
                }

                return querybuilder.getMany()
            })
        ).then(flatten)
    }

    private _cleanOptions(
        options: FindWithoutRelationsOptions
    ): WithRequiredProperty<FindWithoutRelationsOptions, "where"> {
        const where = options.where ?? {}
        if ("description" in where) {
            delete where.description
        }
        if ("title" in where) {
            delete where.title
        }

        return {
            ...options,
            where,
        }
    }
}
