import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
  IAuthProvider,
} from "@medusajs/types"

/**
 * ### constructor
 *
 * The constructor allows you to access resources from the module's container using the first parameter,
 * and the module's options using the second parameter.
 *
 * If you're creating a client or establishing a connection with a third-party service, do it in the constructor.
 *
 * #### Example
 *
 * ```ts
 * import { AbstractAuthModuleProvider } from "@medusajs/framework/utils"
 * import { Logger } from "@medusajs/framework/types"
 *
 * type InjectedDependencies = {
 *   logger: Logger
 * }
 *
 * type Options = {
 *   apiKey: string
 * }
 *
 * class MyAuthProviderService extends AbstractAuthModuleProvider {
 *   static identifier = "my-auth"
 *   protected logger_: Logger
 *   protected options_: Options
 *   // assuming you're initializing a client
 *   protected client
 *
 *   constructor (
 *     { logger }: InjectedDependencies,
 *     options: Options
 *   ) {
 *     super(...arguments)
 *
 *     this.logger_ = logger
 *     this.options_ = options
 *
 *     // assuming you're initializing a client
 *     this.client = new Client(options)
 *   }
 *
 *   // ...
 * }
 *
 * export default MyAuthProviderService
 * ```
 */
export abstract class AbstractAuthModuleProvider implements IAuthProvider {
  /**
   * Every auth provider must have an `identifier` static property. The provider's ID
   * will be stored as `au_{identifier}_{id}`, where `{id}` is the provider's `id` 
   * property in the `medusa-config.ts`.
   * 
   * @example
   * class MyAuthProviderService extends AbstractAuthModuleProvider {
   *   static identifier = "my-auth"
   *   // ...
   * }
   */
  static identifier: string
  /**
   * This property indicates the name used when displaying the provider on a frontend application.
   * 
   * @example
   * class MyAuthProviderService extends AbstractAuthModuleProvider {
   *   static DISPLAY_NAME = "My Auth"
   *   // ...
   * }
   * 
   */
  static DISPLAY_NAME: string

  /**
   * @ignore
   */
  protected readonly container_: any

  /**
   * @deprecated Use `identifier` instead.
   * @ignore
   */
  public get provider() {
    return (this.constructor as typeof AbstractAuthModuleProvider).identifier
  }

  /**
   * @ignore
   */
  public get identifier() {
    return (this.constructor as typeof AbstractAuthModuleProvider).identifier
  }

  /**
   * @ignore
   */
  public get displayName() {
    return (this.constructor as typeof AbstractAuthModuleProvider).DISPLAY_NAME
  }

  /**
   * This method validates the options of the provider set in `medusa-config.ts`.
   * Implementing this method is optional. It's useful if your provider requires custom validation.
   * 
   * If the options aren't valid, throw an error.
   * 
   * @param options - The provider's options.
   * 
   * @example
   * class MyAuthProviderService extends AbstractAuthModuleProvider {
   *   static validateOptions(options: Record<any, any>) {
   *     if (!options.apiKey) {
   *       throw new MedusaError(
   *         MedusaError.Types.INVALID_DATA,
   *         "API key is required in the provider's options."
   *       )
   *     }
   *   }
   *   // ...
   * }
   */
  static validateOptions(options: Record<any, any>): void | never {}

  /**
   * This method authenticates the user.
   *
   * The authentication happens either by directly authenticating or returning a redirect URL to continue
   * the authentication with a third party provider.
   *
   * Related Read: [Learn about the different authentication flows in Medusa](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route).
   *
   * @param {AuthenticationInput} data - The details of the authentication request.
   * @param {AuthIdentityProviderService} authIdentityProviderService - The service used to retrieve or
   * create an auth identity. It has two methods: `create` to create an auth identity,
   * and `retrieve` to retrieve an auth identity. When you authenticate the user, you can create an auth identity
   * using this service.
   * @returns {Promise<AuthenticationResponse>} The authentication response.
   *
   * @example
   * For example, if your authentication provider doesn't require validating a callback:
   *
   * ```ts
   * import {
   *   AuthIdentityProviderService,
   *   AuthenticationInput,
   *   AuthenticationResponse
   * } from "@medusajs/framework/types"
   * // ...
   *
   * class MyAuthProviderService extends AbstractAuthModuleProvider {
   *   // ...
   *   async authenticate(
   *     data: AuthenticationInput,
   *     authIdentityProviderService: AuthIdentityProviderService
   *   ): Promise<AuthenticationResponse> {
   *     const isAuthenticated = false
   *     // TODO perform custom logic to authenticate the user
   *     // for example, verifying a password
   *
   *     if (!isAuthenticated) {
   *       // if the authentication didn't succeed, return
   *       // an object of the following format
   *       return {
   *         success: false,
   *         error: "Incorrect credentials"
   *       }
   *     }
   *
   *     // authentication is successful, retrieve the identity
   *     const authIdentity = await authIdentityProviderService.retrieve({
   *       entity_id: data.body.email, // email or some ID
   *       provider: this.provider
   *     })
   *
   *     return {
   *       success: true,
   *       authIdentity
   *     }
   *   }
   * }
   * ```
   *
   * If your authentication provider requires validating callback:
   *
   * ```ts
   * import {
   *   AuthIdentityProviderService,
   *   AuthenticationInput,
   *   AuthenticationResponse
   * } from "@medusajs/framework/types"
   * // ...
   *
   * class MyAuthProviderService extends AbstractAuthModuleProvider {
   *   // ...
   *   async authenticate(
   *     data: AuthenticationInput,
   *     authIdentityProviderService: AuthIdentityProviderService
   *   ): Promise<AuthenticationResponse> {
   *     const isAuthenticated = false
   *     // TODO perform custom logic to authenticate the user
   *     // ...
   *
   *     if (!isAuthenticated) {
   *       // if the authentication didn't succeed, return
   *       // an object of the following format
   *       return {
   *         success: false,
   *         error: "Incorrect credentials"
   *       }
   *     }
   *
   *     return {
   *       success: true,
   *       location: "some-url.com"
   *     }
   *   }
   * }
   * ```
   */
  abstract authenticate(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse>

  /**
   * This method receives credentails to create a new auth identity. It performs any validation necessary
   * before creating the auth identity.
   *
   * For example, in the `emailpass` provider, this method ensures that the provided email doesn't exist
   * before creating the auth identity.
   *
   * This method is only used in a basic authentication flow, such as when using an email and password
   * to register and authenticate a user.
   *
   * Related Read: [Learn about the different authentication flows in Medusa](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route).
   *
   * @param {AuthenticationInput} data - The details of the authentication request.
   * @param {AuthIdentityProviderService} authIdentityProviderService - The service used to retrieve or
   * create an auth identity. It has two methods: `create` to create an auth identity,
   * and `retrieve` to retrieve an auth identity. When you authenticate the user, you can create an auth identity
   * using this service.
   * @returns The created authentication identity if no errors occur.
   *
   * @example
   * import {
   *   AuthIdentityProviderService,
   *   AuthenticationInput,
   *   AuthenticationResponse
   * } from "@medusajs/framework/types"
   * import { MedusaError } from "@medusajs/framework/utils"
   * // ...
   *
   * class MyAuthProviderService extends AbstractAuthModuleProvider {
   *   // ...
   *   async register(
   *     data: AuthenticationInput,
   *     authIdentityProviderService: AuthIdentityProviderService
   *   ): Promise<AuthenticationResponse> {
   *     try {
   *       await authIdentityService.retrieve({
   *         entity_id: data.body.email, // email or some ID
   *       })
   *
   *       return {
   *         success: false,
   *         error: "Identity with email already exists",
   *       }
   *     } catch (error) {
   *       if (error.type === MedusaError.Types.NOT_FOUND) {
   *         const createdAuthIdentity = await authIdentityProviderService.create({
   *           entity_id: data.body.email, // email or some ID
   *           provider: this.provider,
   *           provider_metadata: {
   *             // can include password or any other relevant information
   *           }
   *         })
   *
   *         return {
   *           success: true,
   *           authIdentity: createdAuthIdentity,
   *         }
   *       }
   *
   *       return { success: false, error: error.message }
   *     }
   *   }
   * }
   */
  register(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    throw new Error(
      `Method 'register' not implemented for provider ${this.provider}`
    )
  }

  /**
   * This method is used to update an auth identity's details.
   *
   * For example, the `emailpass` provider's implementation of this method updates a user's password.
   *
   * @param data - Data relevant to identify the auth identity and what to update in it. For example,
   * the `emailpass` provider expects in this object an `email` and `password` properties.
   * @param authIdentityProviderService - The service used to retrieve or
   * create an auth identity. It has two methods: `create` to create an auth identity,
   * and `retrieve` to retrieve an auth identity. When you authenticate the user, you can create an auth identity
   * using this service.
   * @returns The updated authentication identity if no errors occur.
   *
   * @example
   * import {
   *   AuthIdentityProviderService,
   *   AuthenticationInput,
   *   AuthenticationResponse
   * } from "@medusajs/framework/types"
   * import { MedusaError } from "@medusajs/framework/utils"
   * // ...
   *
   * class MyAuthProviderService extends AbstractAuthModuleProvider {
   *   // ...
   *   async update(
   *     data: Record<string, unknown>,
   *     authIdentityProviderService: AuthIdentityProviderService
   *   ): Promise<AuthenticationResponse> {
   *     try {
   *       const authIdentity = await authIdentityService.update(
   *         data.email, // email or some ID used to identify the auth identity
   *         {
   *           user: data.user // example
   *         }
   *       )
   *
   *       return { success: true, authIdentity }
   *     } catch (error) {
   *       return { success: false, error: error.message }
   *     }
   *   }
   * }
   */
  update(
    data: Record<string, unknown>,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    throw new Error(
      `Method 'update' not implemented for provider ${this.provider}`
    )
  }

  /**
   * This method validates the callback of an authentication request.
   *
   * In an authentication flow that requires performing an action with a third-party service, such as login
   * with a social account, the {@link authenticate} method is called first.
   *
   * Then, the third-party service redirects to a frontend URL passing it a `code` query parameter.
   * The frontend should then send a request to the Medusa application's validate callback API route, passing it the code.
   * That route uses this method to verify the callback's code.
   *
   * If the callback is verified successfully, the provider creates an auth identity for the user, or updates the auth identity's user information.
   *
   * In the auth identity, use the following properties to store additional data:
   *
   * - `provider_metadata`: Store metadata useful for the provider, such as a password hash.
   * - `user_metadata`: Store metadata of the user's details. For example, if the third-party service returns the user's information such as email
   * or name, you store this data in this property.
   *
   * Related Guide: [Learn about the different authentication flows in Medusa](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route).
   *
   * @param {AuthenticationInput} data - The details of the authentication request.
   * @param {AuthIdentityProviderService} authIdentityProviderService - The service used to retrieve or
   * create an auth identity. It has two methods: `create` to create an auth identity,
   * and `retrieve` to retrieve an auth identity. When you authenticate the user, you can create an auth identity
   * using this service.
   * @returns {Promise<AuthenticationResponse>} The authentication response.
   *
   * @example
   * import {
   *   AuthIdentityProviderService,
   *   AuthenticationInput,
   *   AuthenticationResponse
   * } from "@medusajs/framework/types"
   * // ...
   *
   * class MyAuthProviderService extends AbstractAuthModuleProvider {
   *   // ...
   *   async validateCallback(
   *     data: AuthenticationInput,
   *     authIdentityProviderService: AuthIdentityProviderService
   *   ): Promise<AuthenticationResponse> {
   *     const isAuthenticated = false
   *     // TODO perform custom logic to authenticate the user
   *     // ...
   *
   *     if (!isAuthenticated) {
   *       // if the authentication didn't succeed, return
   *       // an object of the following format
   *       return {
   *         success: false,
   *         error: "Something went wrong"
   *       }
   *     }
   *
   *     // authentication is successful, create an auth identity
   *     // if doesn't exist
   *     let authIdentity
   *
   *     try {
   *       authIdentity = await authIdentityProviderService.retrieve({
   *         entity_id: data.body.email, // email or some ID
   *         provider: this.provider
   *       })
   *     } catch (e) {
   *       // The auth identity doesn't exist so create it
   *       authIdentity = await authIdentityProviderService.create({
   *         entity_id: data.body.email, // email or some ID
   *         provider: this.provider,
   *         provider_metadata: {
   *           // can include password or any other relevant information
   *         },
   *         user_metadata: {
   *           // can include data retrieved from the third-party service
   *         }
   *       })
   *     }
   *
   *     return {
   *       success: true,
   *       authIdentity
   *     }
   *   }
   * }
   */
  validateCallback(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    throw new Error(
      `Callback authentication not implemented for provider ${this.provider}`
    )
  }
}
