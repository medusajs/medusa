/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * A notification provider represents a notification service installed in the Medusa backend, either through a plugin or backend customizations. It holds the notification service's installation status.
 */
export interface NotificationProvider {
  /**
   * The ID of the notification provider as given by the notification service.
   */
  id: string
  /**
   * Whether the notification service is installed in the current version. If a notification service is no longer installed, the `is_installed` attribute is set to `false`.
   */
  is_installed: boolean
}
