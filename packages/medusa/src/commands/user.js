import "core-js/stable"
import "regenerator-runtime/runtime"

import express from "express"
import { track } from "medusa-telemetry"

import loaders from "../loaders"
import Logger from "../loaders/logger"
import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export default async function ({
  directory,
  id,
  email,
  password,
  keepAlive,
  invite,
}) {
  track("CLI_USER", { with_id: !!id })
  const app = express()
  try {
    const { container } = await loaders({
      directory,
      expressApp: app,
    })

    const userService = container.resolve(ModuleRegistrationName.USER)
    const authService = container.resolve(ModuleRegistrationName.AUTH)
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const provider = "emailpass"

    if (invite) {
      const invite = await userService.createInvites({ email })

      Logger.info(`
      Invite token: ${invite.token}
      Open the invite in Medusa Admin at: [your-admin-url]/invite?token=${invite.token}`)
    } else {
      const user = await userService.create({ email })

      const { authIdentity } = await authService.authenticate(provider, {
        body: {
          email,
          password,
        },
        authScope: "admin",
      })

      await remoteLink.create([
        {
          [Modules.USER]: {
            user_id: user.id,
          },
          [Modules.AUTH]: {
            auth_identity_id: authIdentity.id,
          },
        },
      ])
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  track("CLI_USER_COMPLETED", { with_id: !!id })

  if (!keepAlive) {
    process.exit()
  }
}
