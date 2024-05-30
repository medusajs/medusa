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

const useV2Command = async (
  { email, password, isInvite, provider = "emailpass" },
  { container }
) => {
  const userService = container.resolve(ModuleRegistrationName.USER)
  const authService = container.resolve(ModuleRegistrationName.AUTH)

  if (isInvite) {
    // The invite flow only works with the V2 version of packages/admin-next/dashboard, so enable the V2 feature flag in admin before using this command
    const invite = await userService.createInvites({ email })

    Logger.info(`
    Invite token: ${invite.token}
    Open the invite in Medusa Admin at: [your-admin-url]/invite?token=${invite.token}`)
  } else {
    const user = await userService.create({ email })

    const { authUser } = await authService.authenticate(provider, {
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

    const configModule = configModuleLoader(directory)
    const featureFlagRouter = featureFlagLoader(configModule)

    if (featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
      await useV2Command({ email, password, isInvite: invite }, { container })
    } else {
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
