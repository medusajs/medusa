const path = require(`path`)
const fs = require("fs")
const util = require("util")
const { createFilePath } = require(`gatsby-source-filesystem`)
const adminDoc = require("../../docs/api/admin-spec3.json")
const storeFront = require("../../docs/api/store-spec3.json")

const useSpec = raw => {
  let tags = {}

  for (const [path, methods] of Object.entries(raw.paths)) {
    for (const [method, specification] of Object.entries(methods)) {
      for (const t of specification.tags) {
        if (t in tags) {
          tags = {
            ...tags,
            [t]: [
              ...tags[t],
              {
                method: method.toUpperCase(),
                path,
                ...specification,
              },
            ],
          }
        } else {
          tags = {
            ...tags,
            [t]: [
              {
                method: method.toUpperCase(),
                path,
                ...specification,
              },
            ],
          }
        }
      }
    }
  }

  return { tags, spec: raw }
}

fs.writeFile(
  "./data/admin-api.json",
  JSON.stringify(useSpec(adminDoc)),
  function (err) {
    if (err) {
      return console.log(err)
    }
    console.log("THE JSON FILE WAS CREATED!!!!")
  }
)

fs.writeFile(
  "./data/storefront-api.json",
  JSON.stringify(useSpec(storeFront)),
  function (err) {
    if (err) {
      return console.log(err)
    }
    console.log("THE JSON FILE WAS CREATED!!!!")
  }
)
