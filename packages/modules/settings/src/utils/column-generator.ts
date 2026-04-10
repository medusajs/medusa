import { SettingsTypes } from "@medusajs/framework/types"
import {
  GraphQLObjectType,
  isEnumType,
  isScalarType,
} from "@medusajs/framework/utils"
import {
  ComputedColumnDefinition,
  getComputedColumnRegistry,
} from "./computed-columns"
import {
  DiscoveredEntity,
  EntityDiscoveryService,
  getUnderlyingType,
  isArrayField,
  isSingleRelationship,
  SchemaTypeMap,
} from "./entity-discovery"
import {
  EntityOverride,
  getAdditionalTypes,
  getDefaultVisibleFields,
  getEntityOverride,
  getFieldFilterRules,
  getFieldOrdering,
} from "./entity-overrides"
import {
  buildFilterConfig,
  FieldFilterRules,
  shouldExcludeField,
} from "./filter-rules"
import { getRelationshipFilterConfig } from "./relationship-filters"
import { inferDataType, inferRenderMode } from "./render-mode-mapper"

// Re-export the AdminColumn type from types for convenience
export type ViewConfigurationColumn = SettingsTypes.ViewConfigurationColumnDTO

/**
 * Property label data for customizing column names.
 */
export interface PropertyLabel {
  id: string
  entity: string
  property: string
  label: string
  description?: string | null
}

/**
 * Format a field name to display name.
 */
function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^\s+/, "")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/**
 * Map semantic type to a valid column category.
 */
function semanticTypeToCategory(
  semanticType: string | undefined
): ViewConfigurationColumn["category"] {
  switch (semanticType) {
    case "identifier":
      return "identifier"
    case "timestamp":
      return "timestamp"
    case "status":
      return "status"
    case "currency":
    case "count":
      return "metric"
    default:
      return "field"
  }
}

/**
 * Generate columns for an entity using the entity discovery service.
 */
export function generateEntityColumns(
  entityDiscovery: EntityDiscoveryService,
  entityKey: string,
  propertyLabels?: Map<string, PropertyLabel>,
  customOverride?: EntityOverride
): ViewConfigurationColumn[] | null {
  if (!entityDiscovery.isInitialized()) {
    return null
  }

  const entity = entityDiscovery.getEntity(entityKey)
  if (!entity) {
    return null
  }

  const override = customOverride || getEntityOverride(entity.name)
  const filterRules = getFieldFilterRules(entity.name, override)
  const defaultVisibleFields = getDefaultVisibleFields(entity.name, override)
  const fieldOrdering = getFieldOrdering(entity.name, override)
  const additionalTypes = getAdditionalTypes(entity.name, override)

  const schemaTypeMap = entityDiscovery.getSchemaTypeMap()
  const columns: ViewConfigurationColumn[] = []
  const processedFields = new Set<string>()

  // Process main entity type
  processEntityType(
    schemaTypeMap,
    entity.graphqlType,
    entity,
    columns,
    processedFields,
    filterRules,
    defaultVisibleFields,
    fieldOrdering,
    propertyLabels
  )

  // Process additional types (e.g., OrderDetail for Order)
  for (const additionalType of additionalTypes) {
    const type = schemaTypeMap[additionalType] as GraphQLObjectType | undefined
    if (type) {
      processEntityType(
        schemaTypeMap,
        additionalType,
        entity,
        columns,
        processedFields,
        filterRules,
        defaultVisibleFields,
        fieldOrdering,
        propertyLabels
      )
    }
  }

  // Add computed columns
  const computedColumnRegistry = getComputedColumnRegistry()
  const computedColumns = computedColumnRegistry.getForEntity(entity.name)

  for (const computed of computedColumns) {
    const columnId = computed.id
    if (processedFields.has(columnId)) {
      continue
    }

    const label = propertyLabels?.get(columnId)
    const hasCustomLabel = !!label

    columns.push({
      id: columnId,
      name: label?.label || computed.name,
      description: label?.description || computed.description,
      field: columnId,
      sortable: false,
      hideable: true,
      default_visible:
        computed.defaultVisible || defaultVisibleFields.includes(columnId),
      data_type: "string",
      semantic_type: "computed",
      context: "display",
      computed: {
        type: computed.renderMode,
        required_fields: computed.requiredFields,
        optional_fields: computed.optionalFields || [],
      },
      render_mode: computed.renderMode,
      default_order: fieldOrdering[columnId] || 850,
      category:
        (computed.category as ViewConfigurationColumn["category"]) ||
        "computed",
      filter: { enabled: false },
      source: { module: entity.module, entity: entity.name },
      custom_label: hasCustomLabel,
      label_id: label?.id,
    })
  }

  // Sort columns by default_order
  columns.sort((a, b) => (a.default_order || 1000) - (b.default_order || 1000))

  return columns
}

/**
 * Process a GraphQL type and add columns.
 */
function processEntityType(
  schemaTypeMap: SchemaTypeMap,
  typeName: string,
  entity: DiscoveredEntity,
  columns: ViewConfigurationColumn[],
  processedFields: Set<string>,
  filterRules: FieldFilterRules,
  defaultVisibleFields: string[],
  fieldOrdering: Record<string, number>,
  propertyLabels?: Map<string, PropertyLabel>,
  parentPath: string = ""
): void {
  const type = schemaTypeMap[typeName] as GraphQLObjectType | undefined
  if (!type || !type.getFields) {
    return
  }

  const fields = type.getFields()

  for (const [fieldName, fieldDef] of Object.entries(fields)) {
    const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName

    // Skip if already processed
    if (processedFields.has(fullPath)) {
      continue
    }

    // Skip excluded fields
    if (shouldExcludeField(fieldName, filterRules)) {
      continue
    }

    const fieldType = (fieldDef as any).type
    const underlyingType = getUnderlyingType(fieldType)
    const isArray = isArrayField(fieldType)

    // Handle scalar and enum types
    if (isScalarType(underlyingType) || isEnumType(underlyingType)) {
      const graphqlTypeName = underlyingType.name
      const dataType = inferDataType(graphqlTypeName, fieldName)
      const { renderMode, semanticType } = inferRenderMode(
        fieldName,
        graphqlTypeName
      )

      const label = propertyLabels?.get(fullPath)
      const hasCustomLabel = !!label

      processedFields.add(fullPath)

      columns.push({
        id: fullPath,
        name: label?.label || formatFieldName(fieldName),
        description: label?.description || undefined,
        field: fullPath,
        sortable: !parentPath, // Only top-level fields are sortable
        hideable: true,
        default_visible: defaultVisibleFields.includes(fullPath),
        data_type: dataType,
        semantic_type: semanticType,
        context: "both",
        render_mode: renderMode,
        default_order: fieldOrdering[fullPath] || 900,
        category: parentPath
          ? "relationship"
          : semanticTypeToCategory(semanticType),
        filter: buildFilterConfig(
          fieldName,
          dataType,
          false,
          semanticType,
          isEnumType(underlyingType)
            ? underlyingType.getValues().map((v: any) => v.value)
            : undefined
        ),
        source: { module: entity.module, entity: entity.name },
        custom_label: hasCustomLabel,
        label_id: label?.id,
      })
    }
    // Handle single relationships (many-to-one, one-to-one)
    else if (
      isSingleRelationship(fieldType) &&
      underlyingType instanceof GraphQLObjectType
    ) {
      // Process nested fields with dot notation (one level deep)
      if (!parentPath) {
        const relatedTypeName = underlyingType.name
        const shouldIncludeRelationship = true

        // Get scalar fields from the related entity
        const relatedFields = underlyingType.getFields()

        // Process all scalar fields of the relationship
        for (const [relatedFieldName, relatedFieldDef] of Object.entries(
          relatedFields
        )) {
          const nestedPath = `${fieldName}.${relatedFieldName}`
          const nestedFieldType = (relatedFieldDef as any).type
          const nestedUnderlyingType = getUnderlyingType(nestedFieldType)

          // Only include scalar fields (not nested objects or arrays)
          if (
            isScalarType(nestedUnderlyingType) &&
            !processedFields.has(nestedPath)
          ) {
            const graphqlTypeName = nestedUnderlyingType.name
            const dataType = inferDataType(graphqlTypeName, relatedFieldName)
            const { renderMode, semanticType } = inferRenderMode(
              relatedFieldName,
              graphqlTypeName
            )

            const label = propertyLabels?.get(nestedPath)
            const hasCustomLabel = !!label

            processedFields.add(nestedPath)

            const filter = buildFilterConfig(
              relatedFieldName,
              dataType,
              false,
              semanticType
            )

            // Add relationship filter config for the id field
            if (shouldIncludeRelationship && relatedFieldName === "id") {
              const relationshipFilter = getRelationshipFilterConfig(
                entity.name,
                fieldName,
                relatedTypeName,
                false,
                schemaTypeMap
              )
              if (relationshipFilter) {
                filter.relationship = relationshipFilter
              }
            }

            columns.push({
              id: nestedPath,
              name:
                label?.label ||
                `${formatFieldName(fieldName)} ${formatFieldName(
                  relatedFieldName
                )}`,
              description: label?.description || undefined,
              field: nestedPath,
              sortable: false,
              hideable: true,
              default_visible: defaultVisibleFields.includes(nestedPath),
              data_type: dataType,
              semantic_type: semanticType,
              context: "both",
              render_mode: renderMode,
              default_order: fieldOrdering[nestedPath] || 950,
              category: "relationship",
              filter,
              source: { module: entity.module, entity: entity.name },
              custom_label: hasCustomLabel,
              label_id: label?.id,
            })
          }
        }
      }
    }
    // Handle array relationships for relationship filter dropdowns
    else if (isArray && underlyingType instanceof GraphQLObjectType) {
      const relatedTypeName = underlyingType.name

      // Add a relationship filter if this is a filterable entity
      if (!parentPath) {
        const relationshipFilter = getRelationshipFilterConfig(
          entity.name,
          fieldName,
          relatedTypeName,
          true,
          schemaTypeMap
        )

        if (relationshipFilter) {
          const label = propertyLabels?.get(fieldName)
          const hasCustomLabel = !!label

          // Add as a virtual filterable column
          columns.push({
            id: `${fieldName}_filter`,
            name: label?.label || formatFieldName(fieldName),
            description: label?.description || undefined,
            field: `${fieldName}.id`,
            sortable: false,
            hideable: true,
            default_visible: false,
            data_type: "string",
            semantic_type: "relationship",
            context: "filter",
            render_mode: "text",
            default_order: 980,
            category: "relationship",
            filter: {
              enabled: true,
              operators: ["in"],
              relationship: relationshipFilter,
            },
            source: { module: entity.module, entity: entity.name },
            custom_label: hasCustomLabel,
            label_id: label?.id,
          })
        }
      }
    }
  }
}

/**
 * Convert a computed column definition to an AdminColumn.
 */
export function computedColumnToAdminColumn(
  column: ComputedColumnDefinition,
  entity: DiscoveredEntity,
  defaultOrder: number = 850,
  label?: PropertyLabel
): ViewConfigurationColumn {
  return {
    id: column.id,
    name: label?.label || column.name,
    description: label?.description || column.description,
    field: column.id,
    sortable: false,
    hideable: true,
    default_visible: column.defaultVisible ?? false,
    data_type: "string",
    semantic_type: "computed",
    context: "display",
    computed: {
      type: column.renderMode,
      required_fields: column.requiredFields,
      optional_fields: column.optionalFields || [],
    },
    render_mode: column.renderMode,
    default_order: defaultOrder,
    category:
      (column.category as ViewConfigurationColumn["category"]) || "computed",
    filter: { enabled: false },
    source: { module: entity.module, entity: entity.name },
    custom_label: !!label,
    label_id: label?.id,
  }
}
