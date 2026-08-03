import { Context } from "../shared-context"
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { AdminColumn, AdminEntityInfo } from "../http/view-configuration/admin"
import {
  ViewConfigurationDTO,
  UserPreferenceDTO,
  PropertyLabelDTO,
  LayoutConfigurationDTO,
  LayoutConfigurationData,
  FilterableViewConfigurationProps,
  FilterableUserPreferenceProps,
  FilterableLayoutConfigurationProps,
  PropertyLabelFilterableFields,
} from "./common"
import {
  CreateViewConfigurationDTO,
  UpdateViewConfigurationDTO,
  CreateLayoutConfigurationDTO,
  CreatePropertyLabelDTO,
  UpdatePropertyLabelDTO,
  UpsertPropertyLabelDTO,
} from "./mutations"

/**
 * The main service interface for the Settings Module.
 */
export interface ISettingsModuleService extends IModuleService {
  // View Configuration methods
  /**
   * This method retrieves a view configuration by its ID.
   *
   * @param {string} id - The ID of the view configuration to retrieve.
   * @param {FindConfig<ViewConfigurationDTO>} config - The configurations determining how the view configuration is retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ViewConfigurationDTO>} The retrieved view configuration.
   *
   * @example
   * A simple example that retrieves a view configuration by its ID:
   *
   * ```ts
   * const viewConfiguration =
   *   await settingsModuleService.retrieveViewConfiguration("viewcfg_123")
   * ```
   *
   * To specify the fields to retrieve:
   *
   * ```ts
   * const viewConfiguration =
   *   await settingsModuleService.retrieveViewConfiguration("viewcfg_123", {
   *     select: ["id", "name", "configuration"],
   *   })
   * ```
   */
  retrieveViewConfiguration(
    id: string,
    config?: FindConfig<ViewConfigurationDTO>,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO>

  /**
   * This method retrieves a list of view configurations based on optional filters and configuration.
   *
   * @param {FilterableViewConfigurationProps} filters - The filters to apply on the retrieved view configurations.
   * @param {FindConfig<ViewConfigurationDTO>} config - The configurations determining how the view configurations are retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ViewConfigurationDTO[]>} The list of view configurations.
   *
   * @example
   * To retrieve a list of view configurations using their IDs:
   *
   * ```ts
   * const viewConfigurations =
   *   await settingsModuleService.listViewConfigurations({
   *     id: ["viewcfg_123", "viewcfg_321"],
   *   })
   * ```
   *
   * To specify the fields to retrieve in each view configuration:
   *
   * ```ts
   * const viewConfigurations =
   *   await settingsModuleService.listViewConfigurations(
   *     {
   *       id: ["viewcfg_123", "viewcfg_321"],
   *     },
   *     {
   *       select: ["id", "name", "configuration"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const viewConfigurations =
   *   await settingsModuleService.listViewConfigurations(
   *     {
   *       entity: "product",
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listViewConfigurations(
    filters?: FilterableViewConfigurationProps,
    config?: FindConfig<ViewConfigurationDTO>,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO[]>

  /**
   * This method retrieves a paginated list of view configurations along with the total count of available view configurations satisfying the provided filters.
   *
   * @param {FilterableViewConfigurationProps} filters - The filters to apply on the retrieved view configurations.
   * @param {FindConfig<ViewConfigurationDTO>} config - The configurations determining how the view configurations are retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ViewConfigurationDTO[], number]>} The list of view configurations along with their total count.
   *
   * @example
   * To retrieve a list of view configurations using their IDs:
   *
   * ```ts
   * const [viewConfigurations, count] =
   *   await settingsModuleService.listAndCountViewConfigurations({
   *     id: ["viewcfg_123", "viewcfg_321"],
   *   })
   * ```
   *
   * To specify the fields to retrieve in each view configuration:
   *
   * ```ts
   * const [viewConfigurations, count] =
   *   await settingsModuleService.listAndCountViewConfigurations(
   *     {
   *       id: ["viewcfg_123", "viewcfg_321"],
   *     },
   *     {
   *       select: ["id", "name", "configuration"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [viewConfigurations, count] =
   *   await settingsModuleService.listAndCountViewConfigurations(
   *     {
   *       entity: "product",
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountViewConfigurations(
    filters?: FilterableViewConfigurationProps,
    config?: FindConfig<ViewConfigurationDTO>,
    sharedContext?: Context
  ): Promise<[ViewConfigurationDTO[], number]>

  /**
   * This method creates view configurations.
   *
   * @param {CreateViewConfigurationDTO[]} data - The view configurations to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ViewConfigurationDTO[]>} The created view configurations.
   *
   * @example
   * const viewConfigurations =
   *   await settingsModuleService.createViewConfigurations([
   *     {
   *       entity: "product",
   *       name: "My Products View",
   *       configuration: {
   *         visible_columns: ["title", "status"],
   *         column_order: ["title", "status"],
   *       },
   *     },
   *   ])
   */
  createViewConfigurations(
    data: CreateViewConfigurationDTO[],
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO[]>

  /**
   * This method creates a view configuration.
   *
   * @param {CreateViewConfigurationDTO} data - The view configuration to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ViewConfigurationDTO>} The created view configuration.
   *
   * @example
   * const viewConfiguration =
   *   await settingsModuleService.createViewConfigurations({
   *     entity: "product",
   *     name: "My Products View",
   *     configuration: {
   *       visible_columns: ["title", "status"],
   *       column_order: ["title", "status"],
   *     },
   *   })
   */
  createViewConfigurations(
    data: CreateViewConfigurationDTO,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO>

  /**
   * This method updates an existing view configuration by its ID.
   *
   * @param {string} idOrSelector - The ID of the view configuration to update.
   * @param {UpdateViewConfigurationDTO} data - The attributes to update in the view configuration.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ViewConfigurationDTO>} The updated view configuration.
   *
   * @example
   * const viewConfiguration =
   *   await settingsModuleService.updateViewConfigurations("viewcfg_123", {
   *     name: "Updated View",
   *   })
   */
  updateViewConfigurations(
    idOrSelector: string,
    data: UpdateViewConfigurationDTO,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO>

  /**
   * This method updates the view configurations matching the specified filters.
   *
   * @param {FilterableViewConfigurationProps} idOrSelector - The filters specifying which view configurations to update.
   * @param {UpdateViewConfigurationDTO} data - The attributes to update in the view configurations.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ViewConfigurationDTO[]>} The updated view configurations.
   *
   * @example
   * const viewConfigurations =
   *   await settingsModuleService.updateViewConfigurations(
   *     { entity: "product" },
   *     { name: "Updated View" }
   *   )
   */
  updateViewConfigurations(
    idOrSelector: FilterableViewConfigurationProps,
    data: UpdateViewConfigurationDTO,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO[]>

  /**
   * This method deletes view configurations by their IDs.
   *
   * @param {string | string[]} ids - The ID(s) of the view configuration(s) to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the view configurations are deleted.
   *
   * @example
   * await settingsModuleService.deleteViewConfigurations("viewcfg_123")
   */
  deleteViewConfigurations(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  // User Preference methods
  /**
   * This method retrieves a user preference by its ID.
   *
   * @param {string} id - The ID of the user preference to retrieve.
   * @param {FindConfig<UserPreferenceDTO>} config - The configurations determining how the user preference is retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserPreferenceDTO>} The retrieved user preference.
   *
   * @example
   * A simple example that retrieves a user preference by its ID:
   *
   * ```ts
   * const userPreference =
   *   await settingsModuleService.retrieveUserPreference("uspref_123")
   * ```
   *
   * To specify the fields to retrieve:
   *
   * ```ts
   * const userPreference =
   *   await settingsModuleService.retrieveUserPreference("uspref_123", {
   *     select: ["id", "key", "value"],
   *   })
   * ```
   */
  retrieveUserPreference(
    id: string,
    config?: FindConfig<UserPreferenceDTO>,
    sharedContext?: Context
  ): Promise<UserPreferenceDTO>

  /**
   * This method retrieves a list of user preferences based on optional filters and configuration.
   *
   * @param {FilterableUserPreferenceProps} filters - The filters to apply on the retrieved user preferences.
   * @param {FindConfig<UserPreferenceDTO>} config - The configurations determining how the user preferences are retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserPreferenceDTO[]>} The list of user preferences.
   *
   * @example
   * To retrieve a list of user preferences using their IDs:
   *
   * ```ts
   * const userPreferences =
   *   await settingsModuleService.listUserPreferences({
   *     id: ["uspref_123", "uspref_321"],
   *   })
   * ```
   *
   * To specify the fields to retrieve in each user preference:
   *
   * ```ts
   * const userPreferences =
   *   await settingsModuleService.listUserPreferences(
   *     {
   *       id: ["uspref_123", "uspref_321"],
   *     },
   *     {
   *       select: ["id", "key", "value"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const userPreferences =
   *   await settingsModuleService.listUserPreferences(
   *     {
   *       user_id: "user_123",
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listUserPreferences(
    filters?: FilterableUserPreferenceProps,
    config?: FindConfig<UserPreferenceDTO>,
    sharedContext?: Context
  ): Promise<UserPreferenceDTO[]>

  /**
   * This method retrieves a paginated list of user preferences along with the total count of available user preferences satisfying the provided filters.
   *
   * @param {FilterableUserPreferenceProps} filters - The filters to apply on the retrieved user preferences.
   * @param {FindConfig<UserPreferenceDTO>} config - The configurations determining how the user preferences are retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[UserPreferenceDTO[], number]>} The list of user preferences along with their total count.
   *
   * @example
   * To retrieve a list of user preferences using their IDs:
   *
   * ```ts
   * const [userPreferences, count] =
   *   await settingsModuleService.listAndCountUserPreferences({
   *     id: ["uspref_123", "uspref_321"],
   *   })
   * ```
   *
   * To specify the fields to retrieve in each user preference:
   *
   * ```ts
   * const [userPreferences, count] =
   *   await settingsModuleService.listAndCountUserPreferences(
   *     {
   *       id: ["uspref_123", "uspref_321"],
   *     },
   *     {
   *       select: ["id", "key", "value"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [userPreferences, count] =
   *   await settingsModuleService.listAndCountUserPreferences(
   *     {
   *       user_id: "user_123",
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountUserPreferences(
    filters?: FilterableUserPreferenceProps,
    config?: FindConfig<UserPreferenceDTO>,
    sharedContext?: Context
  ): Promise<[UserPreferenceDTO[], number]>

  /**
   * This method creates a user preference.
   *
   * @param {object} data - The user preference to create.
   * @param {string} data.user_id - The ID of the user the preference belongs to.
   * @param {string} data.key - The preference's key.
   * @param {any} data.value - The preference's value.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserPreferenceDTO>} The created user preference.
   *
   * @example
   * const userPreference =
   *   await settingsModuleService.createUserPreferences({
   *     user_id: "user_123",
   *     key: "theme",
   *     value: "dark",
   *   })
   */
  createUserPreferences(
    data: { user_id: string; key: string; value: any },
    sharedContext?: Context
  ): Promise<UserPreferenceDTO>

  /**
   * This method creates user preferences.
   *
   * @param {object[]} data - The user preferences to create.
   * @param {string} data.user_id - The ID of the user the preference belongs to.
   * @param {string} data.key - The preference's key.
   * @param {any} data.value - The preference's value.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserPreferenceDTO[]>} The created user preferences.
   *
   * @example
   * const userPreferences =
   *   await settingsModuleService.createUserPreferences([
   *     {
   *       user_id: "user_123",
   *       key: "theme",
   *       value: "dark",
   *     },
   *   ])
   */
  createUserPreferences(
    data: { user_id: string; key: string; value: any }[],
    sharedContext?: Context
  ): Promise<UserPreferenceDTO[]>

  /**
   * This method updates existing user preferences.
   *
   * @param {object[]} data - The user preferences to update.
   * @param {string} data.id - The ID of the user preference to update.
   * @param {any} data.value - The preference's new value.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserPreferenceDTO[]>} The updated user preferences.
   *
   * @example
   * const userPreferences =
   *   await settingsModuleService.updateUserPreferences([
   *     {
   *       id: "uspref_123",
   *       value: "light",
   *     },
   *   ])
   */
  updateUserPreferences(
    data: { id: string; value?: any }[],
    sharedContext?: Context
  ): Promise<UserPreferenceDTO[]>

  /**
   * This method retrieves a user preference by the user's ID and the preference's key.
   *
   * @param {string} userId - The ID of the user the preference belongs to.
   * @param {string} key - The preference's key.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserPreferenceDTO | null>} The user preference, or `null` if none exists for the specified user and key.
   *
   * @example
   * const userPreference = await settingsModuleService.getUserPreference(
   *   "user_123",
   *   "theme"
   * )
   */
  getUserPreference(
    userId: string,
    key: string,
    sharedContext?: Context
  ): Promise<UserPreferenceDTO | null>

  /**
   * This method sets the value of a user preference, creating it if it doesn't exist or updating it otherwise.
   *
   * @param {string} userId - The ID of the user the preference belongs to.
   * @param {string} key - The preference's key.
   * @param {any} value - The preference's value.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserPreferenceDTO>} The created or updated user preference.
   *
   * @example
   * const userPreference = await settingsModuleService.setUserPreference(
   *   "user_123",
   *   "theme",
   *   "dark"
   * )
   */
  setUserPreference(
    userId: string,
    key: string,
    value: any,
    sharedContext?: Context
  ): Promise<UserPreferenceDTO>

  /**
   * This method deletes user preferences by their IDs.
   *
   * @param {string | string[]} ids - The ID(s) of the user preference(s) to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the user preferences are deleted.
   *
   * @example
   * await settingsModuleService.deleteUserPreferences("uspref_123")
   */
  deleteUserPreferences(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  // Helper methods
  /**
   * This method retrieves the active view configuration set for a user and entity.
   *
   * @param {string} entity - The entity to retrieve the active view configuration for.
   * @param {string} userId - The ID of the user to retrieve the active view configuration for.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ViewConfigurationDTO | null>} The active view configuration, or `null` if the user has no active view for the entity.
   *
   * @example
   * const viewConfiguration =
   *   await settingsModuleService.getActiveViewConfiguration(
   *     "product",
   *     "user_123"
   *   )
   */
  getActiveViewConfiguration(
    entity: string,
    userId: string,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO | null>

  /**
   * This method sets the active view configuration for a user and entity.
   *
   * @param {string} entity - The entity to set the active view configuration for.
   * @param {string} userId - The ID of the user to set the active view configuration for.
   * @param {string} viewConfigurationId - The ID of the view configuration to set as active.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the active view configuration is set.
   *
   * @example
   * await settingsModuleService.setActiveViewConfiguration(
   *   "product",
   *   "user_123",
   *   "viewcfg_123"
   * )
   */
  setActiveViewConfiguration(
    entity: string,
    userId: string,
    viewConfigurationId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method retrieves the system default view configuration for an entity.
   *
   * @param {string} entity - The entity to retrieve the system default view configuration for.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ViewConfigurationDTO | null>} The system default view configuration, or `null` if none is set for the entity.
   *
   * @example
   * const viewConfiguration =
   *   await settingsModuleService.getSystemDefaultViewConfiguration("product")
   */
  getSystemDefaultViewConfiguration(
    entity: string,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO | null>

  /**
   * This method clears the active view configuration set for a user and entity, reverting to the default view.
   *
   * @param {string} entity - The entity to clear the active view configuration for.
   * @param {string} userId - The ID of the user to clear the active view configuration for.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the active view configuration is cleared.
   *
   * @example
   * await settingsModuleService.clearActiveViewConfiguration(
   *   "product",
   *   "user_123"
   * )
   */
  clearActiveViewConfiguration(
    entity: string,
    userId: string,
    sharedContext?: Context
  ): Promise<void>

  // Layout Configuration methods
  /**
   * This method retrieves a layout configuration by its ID.
   *
   * @param {string} id - The ID of the layout configuration to retrieve.
   * @param {FindConfig<LayoutConfigurationDTO>} config - The configurations determining how the layout configuration is retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LayoutConfigurationDTO>} The retrieved layout configuration.
   *
   * @example
   * A simple example that retrieves a layout configuration by its ID:
   *
   * ```ts
   * const layoutConfiguration =
   *   await settingsModuleService.retrieveLayoutConfiguration("laycfg_123")
   * ```
   *
   * To specify the fields to retrieve:
   *
   * ```ts
   * const layoutConfiguration =
   *   await settingsModuleService.retrieveLayoutConfiguration("laycfg_123", {
   *     select: ["id", "zone", "configuration"],
   *   })
   * ```
   */
  retrieveLayoutConfiguration(
    id: string,
    config?: FindConfig<LayoutConfigurationDTO>,
    sharedContext?: Context
  ): Promise<LayoutConfigurationDTO>

  /**
   * This method retrieves a list of layout configurations based on optional filters and configuration.
   *
   * @param {FilterableLayoutConfigurationProps} filters - The filters to apply on the retrieved layout configurations.
   * @param {FindConfig<LayoutConfigurationDTO>} config - The configurations determining how the layout configurations are retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LayoutConfigurationDTO[]>} The list of layout configurations.
   *
   * @example
   * To retrieve a list of layout configurations using their IDs:
   *
   * ```ts
   * const layoutConfigurations =
   *   await settingsModuleService.listLayoutConfigurations({
   *     id: ["laycfg_123", "laycfg_321"],
   *   })
   * ```
   *
   * To specify the fields to retrieve in each layout configuration:
   *
   * ```ts
   * const layoutConfigurations =
   *   await settingsModuleService.listLayoutConfigurations(
   *     {
   *       id: ["laycfg_123", "laycfg_321"],
   *     },
   *     {
   *       select: ["id", "zone", "configuration"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const layoutConfigurations =
   *   await settingsModuleService.listLayoutConfigurations(
   *     {
   *       zone: "product.details",
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listLayoutConfigurations(
    filters?: FilterableLayoutConfigurationProps,
    config?: FindConfig<LayoutConfigurationDTO>,
    sharedContext?: Context
  ): Promise<LayoutConfigurationDTO[]>

  /**
   * This method retrieves a paginated list of layout configurations along with the total count of available layout configurations satisfying the provided filters.
   *
   * @param {FilterableLayoutConfigurationProps} filters - The filters to apply on the retrieved layout configurations.
   * @param {FindConfig<LayoutConfigurationDTO>} config - The configurations determining how the layout configurations are retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[LayoutConfigurationDTO[], number]>} The list of layout configurations along with their total count.
   *
   * @example
   * To retrieve a list of layout configurations using their IDs:
   *
   * ```ts
   * const [layoutConfigurations, count] =
   *   await settingsModuleService.listAndCountLayoutConfigurations({
   *     id: ["laycfg_123", "laycfg_321"],
   *   })
   * ```
   *
   * To specify the fields to retrieve in each layout configuration:
   *
   * ```ts
   * const [layoutConfigurations, count] =
   *   await settingsModuleService.listAndCountLayoutConfigurations(
   *     {
   *       id: ["laycfg_123", "laycfg_321"],
   *     },
   *     {
   *       select: ["id", "zone", "configuration"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [layoutConfigurations, count] =
   *   await settingsModuleService.listAndCountLayoutConfigurations(
   *     {
   *       zone: "product.details",
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountLayoutConfigurations(
    filters?: FilterableLayoutConfigurationProps,
    config?: FindConfig<LayoutConfigurationDTO>,
    sharedContext?: Context
  ): Promise<[LayoutConfigurationDTO[], number]>

  /**
   * This method creates layout configurations.
   *
   * @param {CreateLayoutConfigurationDTO[]} data - The layout configurations to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LayoutConfigurationDTO[]>} The created layout configurations.
   *
   * @example
   * const layoutConfigurations =
   *   await settingsModuleService.createLayoutConfigurations([
   *     {
   *       zone: "product.details",
   *       configuration: { widgets: {} },
   *     },
   *   ])
   */
  createLayoutConfigurations(
    data: CreateLayoutConfigurationDTO[],
    sharedContext?: Context
  ): Promise<LayoutConfigurationDTO[]>

  /**
   * This method creates a layout configuration.
   *
   * @param {CreateLayoutConfigurationDTO} data - The layout configuration to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LayoutConfigurationDTO>} The created layout configuration.
   *
   * @example
   * const layoutConfiguration =
   *   await settingsModuleService.createLayoutConfigurations({
   *     zone: "product.details",
   *     configuration: { widgets: {} },
   *   })
   */
  createLayoutConfigurations(
    data: CreateLayoutConfigurationDTO,
    sharedContext?: Context
  ): Promise<LayoutConfigurationDTO>

  /**
   * This method deletes layout configurations by their IDs.
   *
   * @param {string | string[]} ids - The ID(s) of the layout configuration(s) to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the layout configurations are deleted.
   *
   * @example
   * await settingsModuleService.deleteLayoutConfigurations("laycfg_123")
   */
  deleteLayoutConfigurations(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * Retrieve the system default layout configuration for a zone, if any.
   *
   * @param {string} zone - The zone to retrieve the system default layout configuration for.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LayoutConfigurationDTO | null>} The system default layout configuration, or `null` if none is set for the zone.
   *
   * @example
   * const layoutConfiguration =
   *   await settingsModuleService.getSystemDefaultLayoutConfiguration(
   *     "product.details"
   *   )
   */
  getSystemDefaultLayoutConfiguration(
    zone: string,
    sharedContext?: Context
  ): Promise<LayoutConfigurationDTO | null>

  /**
   * Create or replace the single layout configuration for a `(zone, user)`
   * pair. The configuration JSON is replaced, not merged.
   *
   * @param {string} zone - The zone to set the layout configuration for.
   * @param {string} userId - The ID of the user the layout configuration belongs to.
   * @param {LayoutConfigurationData} data - The layout configuration data. It replaces the existing configuration rather than being merged into it.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LayoutConfigurationDTO>} The created or updated layout configuration.
   *
   * @example
   * const layoutConfiguration =
   *   await settingsModuleService.setLayoutConfiguration(
   *     "product.details",
   *     "user_123",
   *     { widgets: {} }
   *   )
   */
  setLayoutConfiguration(
    zone: string,
    userId: string,
    data: LayoutConfigurationData,
    sharedContext?: Context
  ): Promise<LayoutConfigurationDTO>

  /**
   * Create or replace the single system default layout configuration for a
   * zone. The configuration JSON is replaced, not merged.
   *
   * @param {string} zone - The zone to set the system default layout configuration for.
   * @param {LayoutConfigurationData} data - The layout configuration data. It replaces the existing configuration rather than being merged into it.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LayoutConfigurationDTO>} The created or updated system default layout configuration.
   *
   * @example
   * const layoutConfiguration =
   *   await settingsModuleService.setSystemDefaultLayoutConfiguration(
   *     "product.details",
   *     { widgets: {} }
   *   )
   */
  setSystemDefaultLayoutConfiguration(
    zone: string,
    data: LayoutConfigurationData,
    sharedContext?: Context
  ): Promise<LayoutConfigurationDTO>

  /**
   * Remove a user's personal layout configuration for a zone, falling back to
   * the system default.
   *
   * @param {string} zone - The zone to clear the user's layout configuration for.
   * @param {string} userId - The ID of the user whose layout configuration is cleared.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the user's layout configuration is cleared.
   *
   * @example
   * await settingsModuleService.clearLayoutConfiguration(
   *   "product.details",
   *   "user_123"
   * )
   */
  clearLayoutConfiguration(
    zone: string,
    userId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * Retrieve the scope a user is actively viewing for a zone, as persisted via
   * their preferences. Returns null when they have made no explicit choice.
   *
   * @param {string} zone - The zone to retrieve the active layout scope for.
   * @param {string} userId - The ID of the user to retrieve the active layout scope for.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<"personal" | "default" | null>} The active layout scope, or `null` when the user has made no explicit choice.
   *
   * @example
   * const scope = await settingsModuleService.getActiveLayoutScope(
   *   "product.details",
   *   "user_123"
   * )
   */
  getActiveLayoutScope(
    zone: string,
    userId: string,
    sharedContext?: Context
  ): Promise<"personal" | "default" | null>

  /**
   * Persist the scope a user is actively viewing for a zone. Pass null to
   * clear an explicit choice and fall back to the natural resolution.
   *
   * @param {string} zone - The zone to set the active layout scope for.
   * @param {string} userId - The ID of the user to set the active layout scope for.
   * @param {"personal" | "default" | null} scope - The scope to persist, or `null` to clear the explicit choice.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the active layout scope is set.
   *
   * @example
   * await settingsModuleService.setActiveLayoutScope(
   *   "product.details",
   *   "user_123",
   *   "personal"
   * )
   */
  setActiveLayoutScope(
    zone: string,
    userId: string,
    scope: "personal" | "default" | null,
    sharedContext?: Context
  ): Promise<void>

  // Property Label methods
  /**
   * This method retrieves a property label by its ID.
   *
   * @param {string} id - The ID of the property label to retrieve.
   * @param {FindConfig<PropertyLabelDTO>} config - The configurations determining how the property label is retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PropertyLabelDTO>} The retrieved property label.
   *
   * @example
   * A simple example that retrieves a property label by its ID:
   *
   * ```ts
   * const propertyLabel =
   *   await settingsModuleService.retrievePropertyLabel("prlbl_123")
   * ```
   *
   * To specify the fields to retrieve:
   *
   * ```ts
   * const propertyLabel =
   *   await settingsModuleService.retrievePropertyLabel("prlbl_123", {
   *     select: ["id", "entity", "property", "label"],
   *   })
   * ```
   */
  retrievePropertyLabel(
    id: string,
    config?: FindConfig<PropertyLabelDTO>,
    sharedContext?: Context
  ): Promise<PropertyLabelDTO>

  /**
   * This method retrieves a list of property labels based on optional filters and configuration.
   *
   * @param {PropertyLabelFilterableFields} filters - The filters to apply on the retrieved property labels.
   * @param {FindConfig<PropertyLabelDTO>} config - The configurations determining how the property labels are retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PropertyLabelDTO[]>} The list of property labels.
   *
   * @example
   * To retrieve a list of property labels using their IDs:
   *
   * ```ts
   * const propertyLabels =
   *   await settingsModuleService.listPropertyLabels({
   *     id: ["prlbl_123", "prlbl_321"],
   *   })
   * ```
   *
   * To specify the fields to retrieve in each property label:
   *
   * ```ts
   * const propertyLabels =
   *   await settingsModuleService.listPropertyLabels(
   *     {
   *       id: ["prlbl_123", "prlbl_321"],
   *     },
   *     {
   *       select: ["id", "entity", "property", "label"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const propertyLabels =
   *   await settingsModuleService.listPropertyLabels(
   *     {
   *       entity: "Product",
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listPropertyLabels(
    filters?: PropertyLabelFilterableFields,
    config?: FindConfig<PropertyLabelDTO>,
    sharedContext?: Context
  ): Promise<PropertyLabelDTO[]>

  /**
   * This method retrieves a paginated list of property labels along with the total count of available property labels satisfying the provided filters.
   *
   * @param {PropertyLabelFilterableFields} filters - The filters to apply on the retrieved property labels.
   * @param {FindConfig<PropertyLabelDTO>} config - The configurations determining how the property labels are retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[PropertyLabelDTO[], number]>} The list of property labels along with their total count.
   *
   * @example
   * To retrieve a list of property labels using their IDs:
   *
   * ```ts
   * const [propertyLabels, count] =
   *   await settingsModuleService.listAndCountPropertyLabels({
   *     id: ["prlbl_123", "prlbl_321"],
   *   })
   * ```
   *
   * To specify the fields to retrieve in each property label:
   *
   * ```ts
   * const [propertyLabels, count] =
   *   await settingsModuleService.listAndCountPropertyLabels(
   *     {
   *       id: ["prlbl_123", "prlbl_321"],
   *     },
   *     {
   *       select: ["id", "entity", "property", "label"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [propertyLabels, count] =
   *   await settingsModuleService.listAndCountPropertyLabels(
   *     {
   *       entity: "Product",
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountPropertyLabels(
    filters?: PropertyLabelFilterableFields,
    config?: FindConfig<PropertyLabelDTO>,
    sharedContext?: Context
  ): Promise<[PropertyLabelDTO[], number]>

  /**
   * Create a property label.
   *
   * @param {CreatePropertyLabelDTO} data - The property label to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PropertyLabelDTO>} The created property label.
   *
   * @example
   * const propertyLabel =
   *   await settingsModuleService.createPropertyLabels({
   *     entity: "Product",
   *     property: "title",
   *     label: "Name",
   *   })
   */
  createPropertyLabels(
    data: CreatePropertyLabelDTO,
    sharedContext?: Context
  ): Promise<PropertyLabelDTO>

  /**
   * Create multiple property labels.
   *
   * @param {CreatePropertyLabelDTO[]} data - The property labels to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PropertyLabelDTO[]>} The created property labels.
   *
   * @example
   * const propertyLabels =
   *   await settingsModuleService.createPropertyLabels([
   *     {
   *       entity: "Product",
   *       property: "title",
   *       label: "Name",
   *     },
   *   ])
   */
  createPropertyLabels(
    data: CreatePropertyLabelDTO[],
    sharedContext?: Context
  ): Promise<PropertyLabelDTO[]>

  /**
   * Update property labels.
   * Pass data objects with 'id' field to update specific labels.
   *
   * @param {UpdatePropertyLabelDTO[]} data - The property labels to update, each identified by its `id`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PropertyLabelDTO[]>} The updated property labels.
   *
   * @example
   * const propertyLabels =
   *   await settingsModuleService.updatePropertyLabels([
   *     {
   *       id: "prlbl_123",
   *       label: "Product Name",
   *     },
   *   ])
   */
  updatePropertyLabels(
    data: UpdatePropertyLabelDTO[],
    sharedContext?: Context
  ): Promise<PropertyLabelDTO[]>

  /**
   * Update property labels by selector.
   *
   * @param {object} options - The update options.
   * @param {PropertyLabelFilterableFields} options.selector - The filters specifying which property labels to update.
   * @param {UpdatePropertyLabelDTO} options.data - The attributes to update in the matching property labels.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PropertyLabelDTO[]>} The updated property labels.
   *
   * @example
   * const propertyLabels =
   *   await settingsModuleService.updatePropertyLabels({
   *     selector: { entity: "Product" },
   *     data: { description: "The product's title." },
   *   })
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
   *
   * @param {object} selector - The entity and property to retrieve the label for.
   * @param {string} selector.entity - The entity the label applies to.
   * @param {string} [selector.property] - The property path the label applies to.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PropertyLabelDTO>} The retrieved property label.
   *
   * @example
   * const propertyLabel =
   *   await settingsModuleService.retrievePropertyLabel({
   *     entity: "Product",
   *     property: "title",
   *   })
   */
  retrievePropertyLabel(
    { entity, property }: { entity: string; property?: string },
    sharedContext?: Context
  ): Promise<PropertyLabelDTO>

  /**
   * Create or update a property label.
   * If a label already exists for the entity.property combination, it will be updated.
   *
   * @param {UpsertPropertyLabelDTO[]} data - The property labels to create or update.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PropertyLabelDTO[]>} The created or updated property labels.
   *
   * @example
   * const propertyLabels =
   *   await settingsModuleService.upsertPropertyLabels([
   *     {
   *       entity: "Product",
   *       property: "title",
   *       label: "Name",
   *     },
   *   ])
   */
  upsertPropertyLabels(
    data: UpsertPropertyLabelDTO[],
    sharedContext?: Context
  ): Promise<PropertyLabelDTO[]>

  /**
   * This method deletes property labels by their IDs.
   *
   * @param {string | string[]} ids - The ID(s) of the property label(s) to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the property labels are deleted.
   *
   * @example
   * await settingsModuleService.deletePropertyLabels("prlbl_123")
   */
  deletePropertyLabels(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  // Entity Discovery and Column Generation methods

  /**
   * List all discoverable entities from joiner configs.
   * Returns brief info about each entity.
   *
   * @returns {Promise<AdminEntityInfo[]>} The list of discoverable entities.
   *
   * @example
   * const entities = await settingsModuleService.listDiscoverableEntities()
   */
  listDiscoverableEntities(): Promise<AdminEntityInfo[]>

  /**
   * Check if an entity exists by name.
   * Supports PascalCase, kebab-case, snake_case, and plural forms.
   *
   * @param {string} name - The name of the entity to check for.
   * @returns {boolean} Whether an entity with the specified name exists.
   *
   * @example
   * const exists = settingsModuleService.hasEntity("product")
   */
  hasEntity(name: string): boolean

  /**
   * Generate columns for an entity.
   * Returns null if the entity is not found.
   *
   * @param {string} entityKey - The key of the entity to generate columns for.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AdminColumn[] | null>} The generated columns, or `null` if the entity is not found.
   *
   * @example
   * const columns = await settingsModuleService.generateEntityColumns("product")
   */
  generateEntityColumns(
    entityKey: string,
    sharedContext?: Context
  ): Promise<AdminColumn[] | null>

  /**
   * Check if entity discovery has been initialized.
   * Entity discovery is initialized during application start.
   *
   * @returns {boolean} Whether entity discovery has been initialized.
   *
   * @example
   * const initialized = settingsModuleService.isEntityDiscoveryInitialized()
   */
  isEntityDiscoveryInitialized(): boolean
}
