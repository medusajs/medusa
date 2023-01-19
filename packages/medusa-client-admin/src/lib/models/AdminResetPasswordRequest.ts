/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminResetPasswordRequest = {
  /**
   * The Users email.
   */
  email?: string;
  /**
   * The token generated from the 'password-token' endpoint.
   */
  token: string;
  /**
   * The Users new password.
   */
  password: string;
};

