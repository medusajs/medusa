/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Represent an OAuth app
 */
export interface OAuth {
  /**
   * The app's ID
   */
  id: string
  /**
   * The app's display name
   */
  display_name: string
  /**
   * The app's name
   */
  application_name: string
  /**
   * The URL to install the app
   */
  install_url: string | null
  /**
   * The URL to uninstall the app
   */
  uninstall_url: string | null
  /**
   * Any data necessary to the app.
   */
  data: Record<string, any> | null
}
