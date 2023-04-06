import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { Oauth as OAuthModel } from "../models"
import { OauthRepository } from "../repositories/oauth"
import { Selector } from "../types/common"
import { MedusaContainer } from "../types/global"
import { CreateOauthInput, UpdateOauthInput } from "../types/oauth"
import { buildQuery } from "../utils"
import EventBusService from "./event-bus"

type InjectedDependencies = MedusaContainer & {
  manager: EntityManager
  eventBusService: EventBusService
  oauthRepository: typeof OauthRepository
}

class Oauth extends TransactionBaseService {
  static Events = {
    TOKEN_GENERATED: "oauth.token_generated",
    TOKEN_REFRESHED: "oauth.token_refreshed",
  }

  protected container_: InjectedDependencies
  protected oauthRepository_: typeof OauthRepository
  protected eventBus_: EventBusService

  constructor(cradle: InjectedDependencies) {
    super(cradle)

    this.container_ = cradle
    this.oauthRepository_ = cradle.oauthRepository
    this.eventBus_ = cradle.eventBusService
  }

  async retrieveByName(appName: string): Promise<OAuthModel> {
    const repo = this.activeManager_.withRepository(this.oauthRepository_)
    const oauth = await repo.findOne({
      where: {
        application_name: appName,
      },
    })

    if (!oauth) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Oauth application ${appName} not found`
      )
    }

    return oauth
  }

  async retrieve(oauthId: string): Promise<OAuthModel> {
    if (!isDefined(oauthId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"oauthId" must be defined`
      )
    }

    const repo = this.activeManager_.withRepository(this.oauthRepository_)
    const oauth = await repo.findOne({
      where: {
        id: oauthId,
      },
    })

    if (!oauth) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Oauth application with id ${oauthId} not found`
      )
    }

    return oauth
  }

  async list(selector: Selector<OAuthModel>): Promise<OAuthModel[]> {
    const repo = this.activeManager_.withRepository(this.oauthRepository_)

    const query = buildQuery(selector, {})

    return await repo.find(query)
  }

  async create(data: CreateOauthInput): Promise<OAuthModel> {
    const repo = this.activeManager_.withRepository(this.oauthRepository_)

    const application = repo.create({
      display_name: data.display_name,
      application_name: data.application_name,
      install_url: data.install_url,
      uninstall_url: data.uninstall_url,
    })

    return await repo.save(application)
  }

  async update(id: string, update: UpdateOauthInput): Promise<OAuthModel> {
    const repo = this.activeManager_.withRepository(this.oauthRepository_)
    const oauth = await this.retrieve(id)

    if ("data" in update) {
      oauth.data = update.data
    }

    return await repo.save(oauth)
  }

  async registerOauthApp(appDetails: CreateOauthInput): Promise<OAuthModel> {
    const { application_name } = appDetails
    const existing = await this.retrieveByName(application_name)
    if (existing) {
      return existing
    }

    return await this.create(appDetails)
  }

  async generateToken(
    appName: string,
    code: string,
    state: string
  ): Promise<OAuthModel> {
    const app = await this.retrieveByName(appName)
    const service = this.container_[`${app.application_name}Oauth`]
    if (!service) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `An OAuth handler for ${app.display_name} could not be found make sure the plugin is installed`
      )
    }

    if (!(app.data.state === state)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `${app.display_name} could not match state`
      )
    }

    const authData = await service.generateToken(code)

    return await this.update(app.id, {
      data: authData,
    }).then(async (result) => {
      await this.eventBus_.emit(
        `${Oauth.Events.TOKEN_GENERATED}.${appName}`,
        authData
      )
      return result
    })
  }

  async refreshToken(appName: string): Promise<OAuthModel> {
    const app = await this.retrieveByName(appName)
    const refreshToken = app.data.refresh_token
    const service = this.container_[`${app.application_name}Oauth`]
    if (!service) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `An OAuth handler for ${app.display_name} could not be found make sure the plugin is installed`
      )
    }

    const authData = await service.refreshToken(refreshToken)

    return await this.update(app.id, {
      data: authData,
    }).then(async (result) => {
      await this.eventBus_.emit(
        `${Oauth.Events.TOKEN_REFRESHED}.${appName}`,
        authData
      )
      return result
    })
  }
}

export default Oauth
