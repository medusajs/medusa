import {
  AuthenticatedMedusaRequest,
  RBACFieldFilter,
  resolveRoles,
} from "@medusajs/framework/http"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { HttpTypes } from "@medusajs/framework/types"
import { Modules, toSnakeCase } from "@medusajs/framework/utils"
import { filterReadableEntities } from "../../../utils/filter-readable-entities"

/**
 * Removes what the actor can't read from an entity's columns, so the client
 * neither renders empty columns nor requests filter options that would 403:
 * - columns whose field (or computed column's required fields) crosses a
 *   relation to a governed entity the actor can't read are dropped.
 * - relationship filters whose options entity is governed and unreadable are
 *   dropped, along with the column when it only exists as a filter.
 */
export const filterReadableColumns = async (
  req: AuthenticatedMedusaRequest,
  entity: string,
  columns: HttpTypes.AdminColumn[]
): Promise<HttpTypes.AdminColumn[]> => {
  if (!MedusaModule.isInstalled(Modules.RBAC)) {
    return columns
  }

  const roles = await resolveRoles({
    authContext: req.auth_context,
    container: req.scope,
    scope: req.rbac_context?.scope,
  })

  const columnFields = (column: HttpTypes.AdminColumn) => [
    column.field,
    ...(column.computed?.required_fields ?? []),
  ]

  const unreadableFields = new Set(
    await new RBACFieldFilter({
      getActorRoles: async () => roles,
      container: req.scope,
    }).getNotAllowedFields({
      entity,
      parsedFields: {
        fields: new Set(columns.flatMap(columnFields)),
        starFields: new Set(),
      },
    })
  )

  // A relationship filter loads its options from the related entity's list
  // route, so it needs read access to that entity when it's governed.
  const filterResource = (column: HttpTypes.AdminColumn) => {
    const relatedEntity = column.filter?.relationship?.entity
    return relatedEntity ? toSnakeCase(relatedEntity) : undefined
  }

  const filterResources = [
    ...new Set(
      columns
        .map(filterResource)
        .filter((resource): resource is string => !!resource)
    ),
  ]
  const readableResources = new Set(
    await filterReadableEntities(req, filterResources, roles)
  )

  return columns.flatMap((column) => {
    if (columnFields(column).some((field) => unreadableFields.has(field))) {
      return []
    }

    const resource = filterResource(column)
    if (!resource || readableResources.has(resource)) {
      return [column]
    }

    if (column.context === "filter") {
      return []
    }

    const { filter, ...rest } = column
    return [rest]
  })
}
