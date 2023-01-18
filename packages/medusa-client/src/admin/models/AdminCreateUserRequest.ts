/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminCreateUserRequest = {
  /**
   * The Users email.
   */
  email: string;
  /**
   * The name of the User.
   */
  first_name?: string;
  /**
   * The name of the User.
   */
  last_name?: string;
  /**
   * Userrole assigned to the user.
   */
  role?: 'admin' | 'member' | 'developer';
  /**
   * The Users password.
   */
  password: string;
};

