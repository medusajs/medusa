const AppUtils = {
  container_: null,

  setContainer: function (container) {
    this.container_ = container
  },
}

const instance = AppUtils

module.exports = {
  setContainer: (container) => {
    instance.setContainer(container)
  },
  getContainer: () => {
    return instance.container_
  },
}
