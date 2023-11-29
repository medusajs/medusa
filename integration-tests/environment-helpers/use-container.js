const AppUtils = {
  container_: {},

  setContainer: function (container) {
    this.container_[process.env.JEST_WORKER_ID || "1"] = container
  },
}

const instance = AppUtils

module.exports = {
  setContainer: (container) => {
    instance.setContainer(container)
  },
  getContainer: () => {
    return instance.container_[process.env.JEST_WORKER_ID || "1"]
  },
}
