import { asValue, createContainer } from "awilix"
import express from "express"
import jwt from "jsonwebtoken"
import { MockManager } from "medusa-test-utils"
import "reflect-metadata"
import supertest from "supertest"
import config from "../config"
import apiLoader from "../loaders/api"
import passportLoader from "../loaders/passport"
import servicesLoader from "../loaders/services"
import strategiesLoader from "../loaders/strategies"

const adminSessionOpts = {
  cookieName: "session",
  secret: "test",
}
export { adminSessionOpts }
export { clientSessionOpts }

const clientSessionOpts = {
  cookieName: "session",
  secret: "test",
}

const testApp = express()

const container = createContainer()
container.register({
  logger: asValue({
    error: () => {},
  }),
  manager: asValue(MockManager),
})

testApp.set("trust proxy", 1)
testApp.use((req, res, next) => {
  req.session = {}
  const data = req.get("Cookie")
  if (data) {
    req.session = {
      ...req.session,
      ...JSON.parse(data),
    }
  }
  next()
})

servicesLoader({ container })
strategiesLoader({ container })
passportLoader({ app: testApp, container })

testApp.use((req, res, next) => {
  req.scope = container.createScope()
  next()
})

apiLoader({ container, rootDirectory: ".", app: testApp })

const supertestRequest = supertest(testApp)

export async function request(method, url, opts = {}) {
  let { payload, headers } = opts

  const req = supertestRequest[method.toLowerCase()](url)
  headers = headers || {}
  headers.Cookie = headers.Cookie || ""
  if (opts.adminSession) {
    if (opts.adminSession.jwt) {
      opts.adminSession.jwt = jwt.sign(
        opts.adminSession.jwt,
        config.jwtSecret,
        {
          expiresIn: "30m",
        }
      )
    }
    headers.Cookie = JSON.stringify(opts.adminSession) || ""
  }
  if (opts.clientSession) {
    if (opts.clientSession.jwt) {
      opts.clientSession.jwt = jwt.sign(
        opts.clientSession.jwt,
        config.jwtSecret,
        {
          expiresIn: "30d",
        }
      )
    }

    headers.Cookie = JSON.stringify(opts.clientSession) || ""
  }

  for (const name in headers) {
    req.set(name, headers[name])
  }

  if (payload && !req.get("content-type")) {
    req.set("Content-Type", "application/json")
  }

  if (!req.get("accept")) {
    req.set("Accept", "application/json")
  }

  req.set("Host", "localhost")

  let res
  try {
    res = await req.send(JSON.stringify(payload))
  } catch (e) {
    if (e.response) {
      res = e.response
    } else {
      throw e
    }
  }

  // let c =
  //  res.headers["set-cookie"] && cookie.parse(res.headers["set-cookie"][0])
  // res.adminSession =
  //  c &&
  //  c[adminSessionOpts.cookieName] &&
  //  sessions.util.decode(adminSessionOpts, c[adminSessionOpts.cookieName])
  //    .content
  // res.clientSession =
  //  c &&
  //  c[clientSessionOpts.cookieName] &&
  //  sessions.util.decode(clientSessionOpts, c[clientSessionOpts.cookieName])
  //    .content

  return res
}
