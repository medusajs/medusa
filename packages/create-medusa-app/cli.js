#! /usr/bin/env node

const { run } = require("./dist")

run().catch((e) => {
  console.warn(e)
})
