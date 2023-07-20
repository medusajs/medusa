const axios = require("axios").default

const ServerTestUtil = {
  port_: null,
  client_: null,

  setPort: function (port) {
    this.client_ = axios.create({ baseURL: `http://localhost:${port}` })
  },
}

const instance = ServerTestUtil

module.exports = {
  setPort: function (port) {
    instance.setPort(port)
  },
  useApi: function () {
    return instance.client_
  },
}
