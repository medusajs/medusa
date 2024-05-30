import {
  AuthIdentityProviderService,
  AuthenticationInput,
  AuthenticationResponse,
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
   * If the authentication requires an action to perform with a third-party service, such as login with
   * a social account, you can continue the authentication using the {@link validateCallback} method.
   * 
   * @param {AuthenticationInput} data - The details of the authentication request.
   * @param {AuthIdentityProviderService} authIdentityProviderService - The service used to retrieve or 
   * create an auth identity. It has two methods: `create` to create an auth identity,
   * and `retrieve` to retrieve an auth identity. When you authenticate the user, you can create an auth identity
   * using this service.
   * 
   * @privateRemarks
   * TODO add a link to the authentication flow document once it's public.
   * 
   * @example
   * For example, if your authentication provider doesn't require validating a callback:
   * 
   * ```ts
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
   * ```
   * 
   * If your authentication provider requires validating callback:
   * 
   * ```ts
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
   * This method validates the callback of an authentication request.
   * 
   * In an authentication flow that requires performing an action with a third-party service, such as login
   * with a social account, the {@link authenticate} method is called first.
   * 
   * Then, the third-party service redirects to the Medusa application's validate callback API route. 
   * That route uses this method to authenticate the user.
   * 
   * @param {AuthenticationInput} data - The details of the authentication request.
   * @param {AuthIdentityProviderService} authIdentityProviderService - The service used to retrieve or 
   * create an auth identity. It has two methods: `create` to create an auth identity,
   * and `retrieve` to retrieve an auth identity. When you authenticate the user, you can create an auth identity
   * using this service.
   * 
   * @privateRemarks
   * TODO add a link to the authentication flow document once it's public.
   * 
   * @example
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
