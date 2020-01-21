import { createContainer, asValue } from "awilix"
import express from "express"
import supertest from "supertest"
import jwt from "jsonwebtoken"
import sessions from "client-sessions"
import cookie from "cookie"
import servicesLoader from "../loaders/services"
import expressLoader from "../loaders/express"
import apiLoader from "../loaders/api"
import passportLoader from "../loaders/passport"
import config from "../config"

const testApp = express()

const container = createContainer()
container.register({
  logger: asValue({
    error: () => {},
  }),
})

servicesLoader({ container })
expressLoader({ app: testApp })
passportLoader({ app: testApp, container })

// Add the registered services to the request scope
testApp.use((req, res, next) => {
  req.scope = container.createScope()
  next()
})

apiLoader({ app: testApp })

const supertestRequest = supertest(testApp)

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

export async function request(method, url, opts = {}) {
  let { payload, headers } = opts

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

    headers.Cookie +=
      adminSessionOpts.cookieName +
      "=" +
      sessions.util.encode(adminSessionOpts, opts.adminSession) +
      "; "
    // console.log(sessions.util.decode(adminSessionOpts, opts.headers.Cookie))
  }
  if (opts.clientSession) {
    headers.Cookie +=
      clientSessionOpts.cookieName +
      "=" +
      sessions.util.encode(clientSessionOpts, opts.clientSession) +
      "; "
    // console.log(sessions.util.decode(adminSessionOpts, opts.headers.Cookie))
  }

  let req = supertestRequest[method.toLowerCase()](url)

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
