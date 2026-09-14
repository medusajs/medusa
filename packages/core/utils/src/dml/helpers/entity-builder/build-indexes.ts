import { DMLSchema, EntityIndex, QueryCondition } from "@medusajs/types"
import { isObject, isPresent } from "../../../common"
import { DateTimeProperty } from "../../properties/date-time"
import { buildWhereQuery } from "./query-builder"

/*
  The DML provides an opinionated soft deletable entity as a part of every model
  We assume that deleted_at would be scoped in indexes in all cases as an index without the scope
  doesn't seem to be valid. If a case presents itself where one would like to remove the scope, 
  this will need to be updated to include that case.

  Passing `where: null` opts out of the scope entirely and creates a non-partial
  index. This is needed for indexes that back a foreign key: the referential
  integrity triggers Postgres runs for ON UPDATE/ON DELETE CASCADE do not carry
  a deleted_at predicate, so they cannot use a partial index.
*/
export function transformIndexWhere<TSchema extends DMLSchema>(
  index: EntityIndex<TSchema, string | QueryCondition<TSchema>>
): string | undefined {
  if (index.where === null) {
    return undefined
  }

  return isObject(index.where)
    ? transformWhereQb<TSchema>(index.where)
    : transformWhere(index.where)
}

function transformWhereQb<TSchema extends DMLSchema>(
  where: QueryCondition<TSchema & { deleted_at: DateTimeProperty }>
): string {
  if (!isPresent(where.deleted_at)) {
    where.deleted_at = null
  }

  return buildWhereQuery(where)
}

function transformWhere(where?: string): string {
  const lowerCaseWhere = where?.toLowerCase()
  const whereIncludesDeleteable =
    lowerCaseWhere?.includes("deleted_at is null") ||
    lowerCaseWhere?.includes("deleted_at is not null")

  // If where scope does not include a deleted_at scope, we add a soft deletable scope to it
  if (where && !whereIncludesDeleteable) {
    where = where + ` AND deleted_at IS NULL`
  }

  // If where scope isn't present, we will set an opinionated where scope to the index
  if (!where?.length) {
    where = "deleted_at IS NULL"
  }

  return where
}
