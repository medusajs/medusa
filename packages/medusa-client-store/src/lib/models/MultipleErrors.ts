/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Error } from './Error';

export type MultipleErrors = {
  /**
   * Array of errors
   */
  errors?: Array<Error>;
  message?: string;
};

