const ConfigStore = require("configstore")

const config = new ConfigStore(`medusa`, {}, { globalConfigPath: true })

export default {
  getToken: function () {
    return config.get("cloud.login_token")
  },
  setToken: function (token) {
    return config.set("cloud.login_token", token)
  },
}
