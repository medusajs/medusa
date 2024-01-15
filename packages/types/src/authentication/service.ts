import { IModuleService } from "../modules-sdk"
import {
  AuthProviderDTO,
  AuthUserDTO,
  CreateAuthProviderDTO,
  CreateAuthUserDTO,
  FilterableAuthProviderProps,
  FilterableAuthUserProps,
  UpdateAuthProviderDTO,
  UpdateAuthUserDTO,
} from "./common"
import { FindConfig } from "../common"
import { Context } from "../shared-context"

export interface IAuthenticationModuleService extends IModuleService {
  retrieveAuthProvider(
    provider: string,
    config?: FindConfig<AuthProviderDTO>,
    sharedContext?: Context
  ): Promise<AuthProviderDTO>

  listAuthProviders(
    filters?: FilterableAuthProviderProps,
    config?: FindConfig<AuthProviderDTO>,
    sharedContext?: Context
  ): Promise<AuthProviderDTO[]>

  listAndCountAuthProviders(
    filters?: FilterableAuthProviderProps,
    config?: FindConfig<AuthProviderDTO>,
    sharedContext?: Context
  ): Promise<[AuthProviderDTO[], number]>

  createAuthProvider(
    data: CreateAuthProviderDTO[],
    sharedContext?: Context
  ): Promise<AuthProviderDTO[]>

  createAuthProvider(
    data: CreateAuthProviderDTO,
    sharedContext?: Context
  ): Promise<AuthProviderDTO>

  updateAuthProvider(
    data: UpdateAuthProviderDTO[],
    sharedContext?: Context
  ): Promise<AuthProviderDTO[]>

  updateAuthProvider(
    data: UpdateAuthProviderDTO,
    sharedContext?: Context
  ): Promise<AuthProviderDTO>

  deleteAuthProvider(ids: string[], sharedContext?: Context): Promise<void>

  retrieveAuthUser(
    id: string,
    config?: FindConfig<AuthUserDTO>,
    sharedContext?: Context
  ): Promise<AuthUserDTO>

  listAuthUsers(
    filters?: FilterableAuthProviderProps,
    config?: FindConfig<AuthUserDTO>,
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  listAndCountAuthUsers(
    filters?: FilterableAuthUserProps,
    config?: FindConfig<AuthUserDTO>,
    sharedContext?: Context
  ): Promise<[AuthUserDTO[], number]>

  createAuthUser(
    data: CreateAuthUserDTO[],
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  createAuthUser(
    data: CreateAuthUserDTO,
    sharedContext?: Context
  ): Promise<AuthUserDTO>

  updateAuthUser(
    data: UpdateAuthUserDTO[],
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  updateAuthUser(
    data: UpdateAuthUserDTO,
    sharedContext?: Context
  ): Promise<AuthUserDTO>

  deleteAuthUser(ids: string[], sharedContext?: Context): Promise<void>
}
