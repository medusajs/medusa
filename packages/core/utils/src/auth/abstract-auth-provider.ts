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
 * In the constructor, you must pass to the parent constructor two parameters:
 *
 * 1. The first one is an empty object.
 * 2. The second is an object having two properties:
 *    - `provider`: The ID of the provider. For example, `emailpass`.
 *    - `displayName`: The label or displayable name of the provider. For example, `Email and Password Authentication`.
 *
 * #### Example
 *
 * ```ts
 * import { AbstractAuthModuleProvider } from "@medusajs/utils"
 * import { Logger } from "@medusajs/types"
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
 *   protected logger_: Logger
 *   protected options_: Options
 *   // assuming you're initializing a client
 *   protected client
 *
 *   constructor (
 *     { logger }: InjectedDependencies,
 *     options: Options
 *   ) {
 *     super(
 *       {},
 *       {
 *         provider: "my-auth",
 *         displayName: "My Custom Authentication"
 *       }
 *     )
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
   * @ignore
   */
  private static PROVIDER: string
  /**
   * @ignore
   */
  private static DISPLAY_NAME: string

  /**
   * @ignore
   */
  protected readonly container_: any
  /**
   * @ignore
   */
  public get provider() {
    return (this.constructor as typeof AbstractAuthModuleProvider).PROVIDER
  }
  /**
   * @ignore
   */
  public get displayName() {
    return (this.constructor as typeof AbstractAuthModuleProvider).DISPLAY_NAME
  }

  /**
   * Override this static method in order for the loader to validate the options provided to the module provider.
   * @param options
   */
  static validateOptions(options: Record<any, any>): void | never {}

  /**
   * @ignore
   *
   * @privateRemarks
   * Documenting the constructor in the class's TSDocs as it's difficult to relay
   * the necessary information with this constructor's signature.
   */
  protected constructor({}, config: { provider: string; displayName: string }) {
    this.container_ = arguments[0]
    ;(this.constructor as typeof AbstractAuthModuleProvider).PROVIDER ??=
      config.provider
    ;(this.constructor as typeof AbstractAuthModuleProvider).DISPLAY_NAME ??=
      config.displayName
  }

  /**
   * This method authenticates the user.
   *
   * The authentication happens either by directly authenticating or returning a redirect URL to continue
   * the authentication with a third party provider.
   * 
   * Related Read: [Learn about the different authentication flows in Medusa](https://docs.medusajs.com/v2/resources/commerce-modules/auth/authentication-route).
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
   * } from "@medusajs/types"
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
   * } from "@medusajs/types"
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
   * Related Read: [Learn about the different authentication flows in Medusa](https://docs.medusajs.com/v2/resources/commerce-modules/auth/authentication-route).
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
   * } from "@medusajs/types"
   * import { MedusaError } from "@medusajs/utils"
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
   * This method validates the callback of an authentication request.
   *
   * In an authentication flow that requires performing an action with a third-party service, such as login
   * with a social account, the {@link authenticate} method is called first.
   *
   * Then, the third-party service redirects to a frontend URL passing it a `code` query parameter.
   * The frontend should then send a request to the Medusa application's validate callback API route, passing it the code.
   * That route uses this method to verify the callback's code.
   * 
   * If the callback is verified successfully, the provider creates an auth identity for the user.
   * 
   * Related Read: [Learn about the different authentication flows in Medusa](https://docs.medusajs.com/v2/resources/commerce-modules/auth/authentication-route).
   *
   * @param {AuthenticationInput} data - The details of the authentication request.
   * @param {AuthIdentityProviderService} authIdentityProviderService - The service used to retrieve or
   * create an auth identity. It has two methods: `create` to create an auth identity,
   * and `retrieve` to retrieve an auth identity. When you authenticate the user, you can create an auth identity
   * using this service.
   * @returns {Promise<AuthenticationResponse>} The authentication response.
   *
   * @privateRemarks
   * TODO add a link to the authentication flow document once it's public.
   *
   * @example
   * import {
   *   AuthIdentityProviderService,
   *   AuthenticationInput,
   *   AuthenticationResponse
   * } from "@medusajs/types"
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
