import { OperatorMap } from "@medusajs/types"

export const FilterOperatorMap: { [K in keyof OperatorMap<string>]: string } = {
  $and: "$and",
  $or: "$or",
  $eq: "$eq",
  $ne: "$ne",
  $in: "$in",
  $nin: "$nin",
  $not: "$not",
  $gt: "$gt",
  $gte: "$gte",
  $lt: "$lt",
  $lte: "$lte",
  $like: "$like",
  $re: "$re",
  $ilike: "$ilike",
  $fulltext: "$fulltext",
  $overlap: "$overlap",
  $contains: "$contains",
  $contained: "$contained",
  $exists: "$exists",
}
