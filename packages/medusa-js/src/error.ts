'use strict';
/**
 * MedusaError is the base error for every other MedusaError
 */
export default class MedusaError extends Error {
  constructor() {
    super();
  }

  public static factory(type: ErrorType): MedusaError {
    switch (type) {
      case ErrorType.INVALID_REQUEST:
        return new MedusaInvalidRequestError();
      case ErrorType.AUTHENTICATION:
        return new MedusaAuthenticationError();
      case ErrorType.API:
        return new MedusaAPIError();
      case ErrorType.PERMISSION:
        return new MedusaPermissionError();
      case ErrorType.CONNECTION:
        return new MedusaConnectionError();
    }
  }
}

enum ErrorType {
  'INVALID_REQUEST',
  'API',
  'AUTHENTICATION',
  'PERMISSION',
  'CONNECTION',
}

/**
 * MedusaInvalidRequestError is raised when a request as invalid parameters.
 */
export class MedusaInvalidRequestError extends MedusaError {}

/**
 * MedusaAPIError is raised in case no other type cover the problem
 */
export class MedusaAPIError extends MedusaError {}

/**
 * MedusaAuthenticationError is raised when invalid credentials is used to connect to Medusa
 */
export class MedusaAuthenticationError extends MedusaError {}

/**
 * MedusaPermissionErorr is raised when attempting to access a resource without permissions
 */
export class MedusaPermissionError extends MedusaError {}

/**
 * MedusaConnectionError is raised when the Medusa servers can't be reached.
 */
export class MedusaConnectionError extends MedusaError {}
