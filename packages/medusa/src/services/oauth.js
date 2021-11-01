import { MedusaError } from "medusa-core-utils"
import { OauthService } from "medusa-interfaces"

class Oauth extends OauthService {
  static Events = {
    TOKEN_GENERATED: "oauth.token_generated",
    TOKEN_REFRESHED: "oauth.token_refreshed",
  }

  constructor(cradle) {
    super()
    const manager = cradle.manager

    this.manager = manager
    this.container_ = cradle
    this.oauthRepository_ = cradle.oauthRepository
    this.eventBus_ = cradle.eventBusService
  }

  retrieveByName(appName) {
    const repo = this.manager.getCustomRepository(this.oauthRepository_)
    return repo.findOne({
      application_name: appName,
    })
  }

  list(selector) {
    const repo = this.manager.getCustomRepository(this.oauthRepository_)
    return repo.find(selector)
  }

  async create(data) {
    const repo = this.manager.getCustomRepository(this.oauthRepository_)

    const application = repo.create({
      display_name: data.display_name,
      application_name: data.application_name,
      install_url: data.install_url,
      uninstall_url: data.uninstall_url,
    })

    return repo.save(application)
  }

  async update(id, update) {
    const repo = this.manager.getCustomRepository(this.oauthRepository_)
    const oauth = await repo.findOne({ where: { id } })

    if ("data" in update) {
      oauth.data = update.data
    }

    return repo.save(oauth)
  }

  async registerOauthApp(appDetails) {
    const { application_name } = appDetails
    const existing = await this.retrieveByName(application_name)
    if (existing) {
      return
    }

    return this.create(appDetails)
  }

  async generateToken(appName, code, state) {
    const app = await this.retrieveByName(appName)
    const service = this.container_[`${app.application_name}Oauth`]
    if (!service) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `An OAuth handler for ${app.display_name} could not be found make sure the plugin is installed`
      )
    }

    if (!app.state === state) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `${app.display_name} could not match state`
      )
    }

    const authData = await service.generateToken(code)

    return this.update(app.id, {
      data: authData,
    }).then((result) => {
      this.eventBus_.emit(
        `${Oauth.Events.TOKEN_GENERATED}.${appName}`,
        authData
      )
      return result
    })
  }

  async refreshToken(appName) {
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

    return this.update(app.id, {
      data: authData,
    }).then((result) => {
      this.eventBus_.emit(
        `${Oauth.Events.TOKEN_REFRESHED}.${appName}`,
        authData
      )
      return result
    })
  }
}

export default Oauth
