import { MockManager } from "medusa-test-utils"
import { createContainer, asValue } from "awilix"
import express from "express"
import cookieParser from "cookie-parser"
import supertest from "supertest"
import jwt from "jsonwebtoken"
import session from "express-session"
import servicesLoader from "../loaders/services"
import apiLoader from "../loaders/api"
import passportLoader from "../loaders/passport"
import config from "../config"

let adminSessionOpts = {
  cookieName: "session",
  secret: "test",
}
export { adminSessionOpts }

let clientSessionOpts = {
  cookieName: "session",
  secret: "test",
}
export { clientSessionOpts }

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
passportLoader({ app: testApp, container })

testApp.use((req, res, next) => {
  req.scope = container.createScope()
  next()
})

apiLoader({ container, rootDirectory: ".", app: testApp })

const supertestRequest = supertest(testApp)

export async function request(method, url, opts = {}) {
  let { payload, headers } = opts

  let req = supertestRequest[method.toLowerCase()](url)
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

  for (let name in headers) {
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

  //let c =
  //  res.headers["set-cookie"] && cookie.parse(res.headers["set-cookie"][0])
  //res.adminSession =
  //  c &&
  //  c[adminSessionOpts.cookieName] &&
  //  sessions.util.decode(adminSessionOpts, c[adminSessionOpts.cookieName])
  //    .content
  //res.clientSession =
  //  c &&
  //  c[clientSessionOpts.cookieName] &&
  //  sessions.util.decode(clientSessionOpts, c[clientSessionOpts.cookieName])
  //    .content

  return res
}
