#!/usr/bin/env node

const fs = require("fs")
const OAS = require("oas-normalize")
const swaggerInline = require("swagger-inline")
const { exec } = require("child_process")

// Storefront API
swaggerInline(
  ["./packages/medusa/src/models", "./packages/medusa/src/api/routes/store"],
  {
    base: "./docs/api/store-spec3-base.json",
  }
).then((gen) => {
  const oas = new OAS(gen)
  oas
    .validate(true)
    .then(() => {
      fs.writeFileSync("./docs/api/store-spec3.json", gen)
    })
    .catch((err) => {
      console.log("Error in store")
      console.error(err)
      process.exit(0)
    })
})

swaggerInline(
  ["./packages/medusa/src/models", "./packages/medusa/src/api/routes/store"],
  {
    base: "./docs/api/store-spec3-base.json",
    format: "yaml",
  }
).then((gen) => {
  fs.writeFileSync("./docs/api/store-spec3.yaml", gen)
  exec("rm -rf docs/api/store/ && yarn run -- redocly split docs/api/store-spec3.yaml --outDir=docs/api/store/", (error, stdout, stderr) => {
    if (error) {
      throw new Error(`error: ${error.message}`)
    }
    console.log(`${stderr || stdout}`);
  });
})

// Admin API
swaggerInline(
  ["./packages/medusa/src/models", "./packages/medusa/src/api/routes/admin"],
  {
    base: "./docs/api/admin-spec3-base.json",
  }
).then((gen) => {
  const oas = new OAS(gen)
  oas
    .validate(true)
    .then(() => {
      fs.writeFileSync("./docs/api/admin-spec3.json", gen)
    })
    .catch((err) => {
      console.log("Error in admin")
      console.error(err)
      process.exit(0)
    })
})

swaggerInline(
  ["./packages/medusa/src/models", "./packages/medusa/src/api/routes/admin"],
  {
    base: "./docs/api/admin-spec3-base.json",
    format: "yaml",
  }
).then((gen) => {
  fs.writeFileSync("./docs/api/admin-spec3.yaml", gen)
  exec("rm -rf docs/api/admin/ && yarn run -- redocly split docs/api/admin-spec3.yaml --outDir=docs/api/admin/", (error, stdout, stderr) => {
    if (error) {
        throw new Error(`error: ${error.message}`)
    }
    console.log(`${stderr || stdout}`);
    return;
  });
})
