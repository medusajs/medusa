/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

/**
 * The admin's credentials used to log in.
 */
export interface AdminPostAuthReq {
  /**
   * The user's email.
   */
  email: string;
  /**
   * The user's password.
   */
  password: string;
};


