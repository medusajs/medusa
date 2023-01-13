"use strict";

var ConfigStore = require("configstore");

var config;
module.exports = {
  getToken: function getToken() {
    if (!config) {
      config = new ConfigStore("medusa", {}, {
        globalConfigPath: true
      });
    }

    return config.get("cloud.login_token");
  },
  setToken: function setToken(token) {
    if (!config) {
      config = new ConfigStore("medusa", {}, {
        globalConfigPath: true
      });
    }

    return config.set("cloud.login_token", token);
  }
};