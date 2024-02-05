import {
  AuthProviderDTO,
  AuthUserDTO,
  AuthenticationInput,
  AuthenticationResponse,
  CreateAuthProviderDTO,
  CreateAuthUserDTO,
  FilterableAuthProviderProps,
  FilterableAuthUserProps,
  UpdateAuthProviderDTO,
  UpdateAuthUserDTO,
} from "./common"

import { Context } from "../shared-context"
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"

export type JWTGenerationOptions = {
  expiresIn?: string | number
}

export interface IAuthModuleService extends IModuleService {
  authenticate(
    provider: string,
    providerData: AuthenticationInput
  ): Promise<AuthenticationResponse>

  validateCallback(
    provider: string,
    providerData: AuthenticationInput
  ): Promise<AuthenticationResponse>

  retrieve(
    id: string,
    config?: FindConfig<AuthUserDTO>,
    sharedContext?: Context
  ): Promise<AuthUserDTO>

  list(
    filters?: FilterableAuthProviderProps,
    config?: FindConfig<AuthUserDTO>,
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  listAndCount(
    filters?: FilterableAuthUserProps,
    config?: FindConfig<AuthUserDTO>,
    sharedContext?: Context
  ): Promise<[AuthUserDTO[], number]>

  create(
    data: CreateAuthUserDTO[],
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  create(data: CreateAuthUserDTO, sharedContext?: Context): Promise<AuthUserDTO>

  update(
    data: UpdateAuthUserDTO[],
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  update(data: UpdateAuthUserDTO, sharedContext?: Context): Promise<AuthUserDTO>

  deleteAuthUsers(ids: string[], sharedContext?: Context): Promise<void>
}
