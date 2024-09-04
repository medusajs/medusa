const axios = require("axios").default

const ServerTestUtil = {
  port_: null,
  client_: null,
  expressServer_: null,

  setPort: function (port) {
    this.client_ = axios.create({ baseURL: `http://localhost:${port}` })
  },

  setExpressServer: function (expressServer) {
    this.expressServer_ = expressServer
  },
}

const instance = ServerTestUtil

module.exports = {
  setPort: function (port) {
    instance.setPort(port)
  },
  setExpressServer: function (expressServer) {
    instance.setExpressServer(expressServer)
  },
  useApi: function () {
    return instance.client_
  },
  useExpressServer: function () {
    return instance.expressServer_
  },
}
