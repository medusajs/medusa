const path = require("path")
const express = require("express")
const getPort = require("get-port")
const { isObject } = require("@medusajs/utils")

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
