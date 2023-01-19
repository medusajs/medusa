/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostAppsReq = {
  /**
   * Name of the application for the token to be generated for.
   */
  application_name: string;
  /**
   * State of the application.
   */
  state: string;
  /**
   * The code for the generated token.
   */
  code: string;
};

