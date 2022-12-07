import jwt, { Jwt, JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken"
import { ConfigModule } from "../types/global"
import formatRegistrationName from "../utils/format-registration-name"
import { resolve } from "path"
import { MedusaError } from "medusa-core-utils"

type InjectedDependencies = {
  configModule: ConfigModule
}

class TokenService {
  static RESOLUTION_KEY = formatRegistrationName(resolve(__dirname, __filename))

  protected readonly configModule_: ConfigModule

  constructor({ configModule }: InjectedDependencies) {
    this.configModule_ = configModule
  }

  verifyToken(
    token: string,
    options?: VerifyOptions
  ): Jwt | JwtPayload | string {
    const { jwt_secret } = this.configModule_.projectConfig
    if (jwt_secret) {
      return jwt.verify(token, jwt_secret, options)
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Please configure jwt_secret"
    )
  }

  signToken(data: string | Buffer | object, options?: SignOptions): string {
    const { jwt_secret } = this.configModule_.projectConfig
    if (jwt_secret) {
      return jwt.sign(data, jwt_secret, options)
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Please configure a jwt token"
      )
    }
  }
}

export default TokenService
