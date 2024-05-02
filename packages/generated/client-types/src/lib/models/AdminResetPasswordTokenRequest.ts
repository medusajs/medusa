/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

/**
 * The details of the password reset token request.
 */
export interface AdminResetPasswordTokenRequest {
  /**
   * The User's email.
   */
  email: string;
};


