import { SettingsTypes } from "@medusajs/framework/types"
import {
  GraphQLEnumType,
  GraphQLObjectType,
  isEnumType,
  isScalarType,
  Kind,
} from "@medusajs/framework/utils"
import { getComputedColumnRegistry } from "./computed-columns"
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
  getFieldMetadata,
  getFieldOrdering,
  getFieldRenderModes,
  getNonFilterableFields,
  getNonSortableFields,
} from "./entity-overrides"
import {
  buildFilterConfig,
  FieldFilterRules,
  shouldExcludeField,
} from "./filter-rules"
import { getRelationshipFilterConfig } from "./relationship-filters"
import {
  inferDataType,
  inferRenderMode,
  RenderMode,
} from "./render-mode-mapper"

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
 * Resolve the real (stored) values of a GraphQL enum.
 *
 * DML-generated enums uppercase the member name and keep the real stored value
 * in an `@enumValue(value: "...")` directive (e.g. `STANDARD @enumValue(value:
 * "standard")`). Honor that directive so filters use the value the DB actually
 * stores; fall back to the member value for enums declared without it.
 */
function getEnumValues(enumType: GraphQLEnumType): string[] {
  return enumType.getValues().map((value) => {
    const directive = value.astNode?.directives?.find(
      (d) => d.name.value === "enumValue"
    )
    const arg = directive?.arguments?.find((a) => a.name.value === "value")
    if (arg?.value.kind === Kind.STRING) {
      return arg.value.value
    }
    return String(value.value)
  })
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
  const defaultFieldOrdering = getFieldOrdering(entity.name, override)
  const fieldRenderModes = getFieldRenderModes(entity.name, override)
  const fieldMetadata = getFieldMetadata(entity.name, override)
  const additionalTypes = getAdditionalTypes(entity.name, override)
  const nonFilterableFields = getNonFilterableFields(entity.name, override)
  const nonSortableFields = getNonSortableFields(entity.name, override)

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
    defaultFieldOrdering,
    fieldRenderModes,
    fieldMetadata,
    nonFilterableFields,
    nonSortableFields,
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
        defaultFieldOrdering,
        fieldRenderModes,
        fieldMetadata,
        nonFilterableFields,
        nonSortableFields,
        propertyLabels
      )
    }
  }

  // Add computed columns
  const computedColumnRegistry = getComputedColumnRegistry()
  const computedColumns = computedColumnRegistry.get(entity.name)

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
      sortable: computed.sortable ?? false,
      hideable: true,
      default_visible:
        computed.defaultVisible || defaultVisibleFields.includes(columnId),
      data_type: (computed.dataType ??
        "string") as ViewConfigurationColumn["data_type"],
      semantic_type: computed.renderMode ? "computed" : "relationship",
      context: computed.context ?? "display",
      // Only display columns carry a compute (render + required fields);
      // filter-only injected columns omit it.
      computed: computed.renderMode
        ? {
            type: computed.renderMode,
            required_fields: computed.requiredFields ?? [],
            optional_fields: computed.optionalFields || [],
          }
        : undefined,
      metadata: computed.metadata,
      render_mode: computed.renderMode,
      default_order: defaultFieldOrdering[columnId] || 850,
      category:
        (computed.category as ViewConfigurationColumn["category"]) ||
        "computed",
      filter: computed.filter ?? { enabled: false },
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
  defaultFieldOrdering: Record<string, number>,
  fieldRenderModes: Record<string, RenderMode>,
  fieldMetadata: Record<string, Record<string, any>>,
  nonFilterableFields: string[],
  nonSortableFields: string[],
  propertyLabels?: Map<string, PropertyLabel>,
  parentPath: string = ""
): void {
  const type = schemaTypeMap[typeName] as GraphQLObjectType | undefined
  if (!type || !type.getFields) {
    return
  }

  const fields = type.getFields()

  // Foreign keys made redundant by a single relationship of the same name
  // (e.g. collection_id -> collection.id). The relationship's `.id` column
  // covers both filtering and display, so drop the raw FK to avoid duplicates.
  const redundantForeignKeys = new Set<string>()
  if (!parentPath) {
    for (const [fieldName, fieldDef] of Object.entries(fields)) {
      const fieldType = (fieldDef as any).type
      if (
        isSingleRelationship(fieldType) &&
        getUnderlyingType(fieldType) instanceof GraphQLObjectType
      ) {
        redundantForeignKeys.add(`${fieldName}_id`)
      }
    }
  }

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

    // Skip FKs covered by their relationship's `.id` column
    if (redundantForeignKeys.has(fullPath)) {
      continue
    }

    const fieldType = (fieldDef as any).type
    const underlyingType = getUnderlyingType(fieldType)
    const isArray = isArrayField(fieldType)

    // Handle scalar and enum types
    if (isScalarType(underlyingType) || isEnumType(underlyingType)) {
      const dataType = inferDataType(underlyingType, fieldName)
      const { renderMode: inferredRenderMode, semanticType } = inferRenderMode(
        fieldName,
        underlyingType
      )
      const renderMode = fieldRenderModes[fullPath] ?? inferredRenderMode

      const label = propertyLabels?.get(fullPath)
      const hasCustomLabel = !!label

      processedFields.add(fullPath)

      const filter = nonFilterableFields.includes(fullPath)
        ? { enabled: false }
        : buildFilterConfig(
            fieldName,
            dataType,
            false,
            semanticType,
            isEnumType(underlyingType)
              ? getEnumValues(underlyingType)
              : undefined
          )

      columns.push({
        id: fullPath,
        name: label?.label || formatFieldName(fieldName),
        description: label?.description || undefined,
        field: fullPath,
        sortable:
          !parentPath &&
          dataType !== "object" &&
          !nonSortableFields.includes(fullPath), // Only top-level fields are sortable
        hideable: true,
        default_visible: defaultVisibleFields.includes(fullPath),
        data_type: dataType,
        semantic_type: semanticType,
        context: "both",
        render_mode: renderMode,
        metadata: fieldMetadata[fullPath],
        default_order: defaultFieldOrdering[fullPath] || 900,
        category: parentPath
          ? "relationship"
          : semanticTypeToCategory(semanticType),
        filter,
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
            const dataType = inferDataType(
              nestedUnderlyingType,
              relatedFieldName
            )
            const { renderMode: inferredRenderMode, semanticType } =
              inferRenderMode(relatedFieldName, nestedUnderlyingType)
            const renderMode =
              fieldRenderModes[nestedPath] ?? inferredRenderMode

            const label = propertyLabels?.get(nestedPath)
            const hasCustomLabel = !!label

            processedFields.add(nestedPath)

            const filter = nonFilterableFields.includes(nestedPath)
              ? { enabled: false }
              : buildFilterConfig(
                  relatedFieldName,
                  dataType,
                  false,
                  semanticType,
                  isEnumType(nestedUnderlyingType)
                    ? getEnumValues(nestedUnderlyingType)
                    : undefined
                )

            // Note: nested .id paths in nonFilterableFields produce
            // { enabled: false, relationship: {...} }; not currently reachable.
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
              metadata: fieldMetadata[nestedPath],
              default_order: defaultFieldOrdering[nestedPath] || 950,
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
