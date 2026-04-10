import { Context } from "../shared-context"
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { AdminColumn, AdminEntityInfo } from "../http/view-configuration/admin"
import {
  ViewConfigurationDTO,
  UserPreferenceDTO,
  PropertyLabelDTO,
  FilterableViewConfigurationProps,
  FilterableUserPreferenceProps,
  PropertyLabelFilterableFields,
} from "./common"
import {
  CreateViewConfigurationDTO,
  UpdateViewConfigurationDTO,
  CreatePropertyLabelDTO,
  UpdatePropertyLabelDTO,
  UpsertPropertyLabelDTO,
} from "./mutations"

export interface ISettingsModuleService extends IModuleService {
  // View Configuration methods
  retrieveViewConfiguration(
    id: string,
    config?: FindConfig<ViewConfigurationDTO>,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO>

  listViewConfigurations(
    filters?: FilterableViewConfigurationProps,
    config?: FindConfig<ViewConfigurationDTO>,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO[]>

  listAndCountViewConfigurations(
    filters?: FilterableViewConfigurationProps,
    config?: FindConfig<ViewConfigurationDTO>,
    sharedContext?: Context
  ): Promise<[ViewConfigurationDTO[], number]>

  createViewConfigurations(
    data: CreateViewConfigurationDTO[],
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO[]>

  createViewConfigurations(
    data: CreateViewConfigurationDTO,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO>

  updateViewConfigurations(
    idOrSelector: string,
    data: UpdateViewConfigurationDTO,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO>

  updateViewConfigurations(
    idOrSelector: FilterableViewConfigurationProps,
    data: UpdateViewConfigurationDTO,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO[]>

  deleteViewConfigurations(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  // User Preference methods
  retrieveUserPreference(
    id: string,
    config?: FindConfig<UserPreferenceDTO>,
    sharedContext?: Context
  ): Promise<UserPreferenceDTO>

  listUserPreferences(
    filters?: FilterableUserPreferenceProps,
    config?: FindConfig<UserPreferenceDTO>,
    sharedContext?: Context
  ): Promise<UserPreferenceDTO[]>

  listAndCountUserPreferences(
    filters?: FilterableUserPreferenceProps,
    config?: FindConfig<UserPreferenceDTO>,
    sharedContext?: Context
  ): Promise<[UserPreferenceDTO[], number]>

  createUserPreferences(
    data: { user_id: string; key: string; value: any },
    sharedContext?: Context
  ): Promise<UserPreferenceDTO>

  createUserPreferences(
    data: { user_id: string; key: string; value: any }[],
    sharedContext?: Context
  ): Promise<UserPreferenceDTO[]>

  updateUserPreferences(
    data: { id: string; value?: any }[],
    sharedContext?: Context
  ): Promise<UserPreferenceDTO[]>

  getUserPreference(
    userId: string,
    key: string,
    sharedContext?: Context
  ): Promise<UserPreferenceDTO | null>

  setUserPreference(
    userId: string,
    key: string,
    value: any,
    sharedContext?: Context
  ): Promise<UserPreferenceDTO>

  deleteUserPreferences(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  // Helper methods
  getActiveViewConfiguration(
    entity: string,
    userId: string,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO | null>

  setActiveViewConfiguration(
    entity: string,
    userId: string,
    viewConfigurationId: string,
    sharedContext?: Context
  ): Promise<void>

  getSystemDefaultViewConfiguration(
    entity: string,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO | null>

  clearActiveViewConfiguration(
    entity: string,
    userId: string,
    sharedContext?: Context
  ): Promise<void>

  // Property Label methods
  retrievePropertyLabel(
    id: string,
    config?: FindConfig<PropertyLabelDTO>,
    sharedContext?: Context
  ): Promise<PropertyLabelDTO>

  listPropertyLabels(
    filters?: PropertyLabelFilterableFields,
    config?: FindConfig<PropertyLabelDTO>,
    sharedContext?: Context
  ): Promise<PropertyLabelDTO[]>

  listAndCountPropertyLabels(
    filters?: PropertyLabelFilterableFields,
    config?: FindConfig<PropertyLabelDTO>,
    sharedContext?: Context
  ): Promise<[PropertyLabelDTO[], number]>

  /**
   * Create a property label.
   */
  createPropertyLabels(
    data: CreatePropertyLabelDTO,
    sharedContext?: Context
  ): Promise<PropertyLabelDTO>

  /**
   * Create multiple property labels.
   */
  createPropertyLabels(
    data: CreatePropertyLabelDTO[],
    sharedContext?: Context
  ): Promise<PropertyLabelDTO[]>

  /**
   * Update property labels.
   * Pass data objects with 'id' field to update specific labels.
   */
  updatePropertyLabels(
    data: UpdatePropertyLabelDTO[],
    sharedContext?: Context
  ): Promise<PropertyLabelDTO[]>

  /**
   * Update property labels by selector.
   */
  updatePropertyLabels(
    options: {
      selector: PropertyLabelFilterableFields
      data: UpdatePropertyLabelDTO
    },
    sharedContext?: Context
  ): Promise<PropertyLabelDTO[]>

  /**
   * Retrieve a property label by entity and property.
   */
  retrievePropertyLabel(
    { entity, property }: { entity: string; property?: string },
    sharedContext?: Context
  ): Promise<PropertyLabelDTO>

  /**
   * Create or update a property label.
   * If a label already exists for the entity.property combination, it will be updated.
   */
  upsertPropertyLabels(
    data: UpsertPropertyLabelDTO[],
    sharedContext?: Context
  ): Promise<PropertyLabelDTO[]>

  deletePropertyLabels(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  // Entity Discovery and Column Generation methods

  /**
   * List all discoverable entities from joiner configs.
   * Returns brief info about each entity.
   */
  listDiscoverableEntities(): AdminEntityInfo[]

  /**
   * Check if an entity exists by name.
   * Supports PascalCase, kebab-case, snake_case, and plural forms.
   */
  hasEntity(name: string): boolean

  /**
   * Generate columns for an entity.
   * Returns null if the entity is not found.
   */
  generateEntityColumns(
    entityKey: string,
    sharedContext?: Context
  ): Promise<AdminColumn[] | null>

  /**
   * Check if entity discovery has been initialized.
   * Entity discovery is initialized during application start.
   */
  isEntityDiscoveryInitialized(): boolean
}
