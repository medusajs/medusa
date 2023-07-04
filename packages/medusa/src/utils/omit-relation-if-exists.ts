/**
 *
 * @param relations relations from which a relation should be removed
 * @param relation relation to be removed
 * @returns tuple containing the new relations and a boolean indicating whether the relation was found in the relations array
 */
export const omitRelationIfExists = (
  relations: string[],
  relation: string
): [string[], boolean] => {
  const filteredRelations = relations.filter((rel) => rel !== relation)
  const includesRelation = relations.length !== filteredRelations.length

  return [relations, includesRelation]
}
