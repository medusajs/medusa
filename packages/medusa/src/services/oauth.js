import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { OauthService } from "medusa-interfaces"

class Oauth extends OauthService {
  static Events = {
    TOKEN_GENERATED: "oauth.token_generated",
    TOKEN_REFRESHED: "oauth.token_refreshed",
  }

  constructor(cradle) {
    super()
    this.container_ = cradle
    this.model_ = cradle.oauthModel
    this.eventBus_ = cradle.eventBusService
  }

  retrieveByName(appName) {
    return this.model_.findOne({
      application_name: appName,
    })
  }

  list(selector) {
    return this.model_.find(selector)
  }

  create(data) {
    return this.model_.create({
      display_name: data.display_name,
      application_name: data.application_name,
      install_url: data.install_url,
      uninstall_url: data.uninstall_url,
    })
  }

  update(id, update) {
    return this.model_.updateOne(
      {
        _id: id,
      },
      update
    )
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

    return this.update(app._id, {
      data: authData,
    }).then(result => {
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

    return this.update(app._id, {
      data: authData,
    }).then(result => {
      this.eventBus_.emit(
        `${Oauth.Events.TOKEN_REFRESHED}.${appName}`,
        authData
      )
      return result
    })
  }
}

export default Oauth
