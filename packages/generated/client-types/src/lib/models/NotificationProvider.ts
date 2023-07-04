/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Represents a notification provider plugin and holds its installation status.
 */
export interface NotificationProvider {
  /**
   * The id of the notification provider as given by the plugin.
   */
  id: string
  /**
   * Whether the plugin is installed in the current version. Plugins that are no longer installed are not deleted by will have this field set to `false`.
   */
  is_installed: boolean
}
