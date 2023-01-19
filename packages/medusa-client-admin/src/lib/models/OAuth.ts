/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Represent an OAuth app
 */
export type OAuth = {
  /**
   * The app's ID
   */
  id: string;
  /**
   * The app's display name
   */
  display_name: string;
  /**
   * The app's name
   */
  application_name: string;
  /**
   * The URL to install the app
   */
  install_url?: string;
  /**
   * The URL to uninstall the app
   */
  uninstall_url?: string;
  /**
   * Any data necessary to the app.
   */
  data?: Record<string, any>;
};

