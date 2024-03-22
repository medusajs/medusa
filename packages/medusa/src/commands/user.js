import "core-js/stable"
import "regenerator-runtime/runtime"

import express from "express"
import { track } from "medusa-telemetry"

import loaders from "../loaders"
import Logger from "../loaders/logger"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import featureFlagLoader from "../loaders/feature-flags"
import configModuleLoader from "../loaders/config"
import { MedusaV2Flag } from "@medusajs/utils"

// TEMP: Only supporting emailpass
const createV2User = async ({ email, password }, { container }) => {
  const authService = container.resolve(ModuleRegistrationName.AUTH)
  const userService = container.resolve(ModuleRegistrationName.USER)
  const user = await userService.create({ email })
  const { authUser } = await authService.authenticate("emailpass", {
    body: {
      email,
      password,
    },
    authScope: "admin",
  })

  await authService.update({
    id: authUser.id,
    app_metadata: {
      user_id: user.id,
    },
  })
}

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

    if (invite) {
      const inviteService = container.resolve("inviteService")
      await inviteService.create(email, "admin")
      const invite = await inviteService.list({
        user_email: email,
      })
      Logger.info(`
      Invite token: ${invite[0].token}
      Open the invite in Medusa Admin at: [your-admin-url]/invite?token=${invite[0].token}`)
    } else {
      const configModule = configModuleLoader(directory)
      const featureFlagRouter = featureFlagLoader(configModule)

      if (featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
        await createV2User({ email, password }, { container })
      } else {
        const userService = container.resolve("userService")
        await userService.create({ id, email }, password)
      }
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
