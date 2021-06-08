const ConfigStore = require("configstore")

let config

module.exports = {
  getToken: function() {
    if (!config) {
      config = new ConfigStore(`medusa`, {}, { globalConfigPath: true })
    }

    return config.get("login_token")
  },
  setToken: function(token) {
    if (!config) {
      config = new ConfigStore(`medusa`, {}, { globalConfigPath: true })
    }

    return config.set("login_token", token)
  },
}
