const ServerTestUtil = {
  server_: null,
  app_: null,

  setApp: function (app) {
    this.app_ = app
  },

  start: async function () {
    this.server_ = await new Promise((resolve, reject) => {
      const s = this.app_.listen(PORT, (err) => {
        if (err) {
          reject(err)
        }
      })
      resolve(s)
    })
  },

  kill: function () {
    return new Promise((resolve, _) => {
      if (this.server_) {
        this.server_.close(() => resolve())
      }
      resolve()
    })
  },
}

const instance = ServerTestUtil

module.exports = {
  setApp: function (app) {
    instance.setApp(app)
    return instance
  },

  useServer: function () {
    return instance
  },
}
