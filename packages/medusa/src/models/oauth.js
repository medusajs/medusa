import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

class OauthModel extends BaseModel {
  static modelName = "Oauth"

  static schema = {
    display_name: { type: String, required: true },
    application_name: { type: String, required: true, unique: true },
    install_url: { type: String, required: true },
    uninstall_url: { type: String, default: "" },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default OauthModel
