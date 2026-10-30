import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  ContainerRegistrationKeys,
  Modules,
  RBAC_SUPER_ADMIN_ROLE_ID,
} from "@medusajs/framework/utils"
import { track } from "@medusajs/telemetry"
import express from "express"
import loaders from "../loaders"

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
    process.env.MEDUSA_WORKER_MODE = "server"

    const { container } = await loaders({
      directory,
      expressApp: app,
      skipLoadingEntryPoints: true,
    })
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    const authService = container.resolve(Modules.AUTH)
    const workflowService = container.resolve(Modules.WORKFLOW_ENGINE)

    const provider = "emailpass"

    // Check if RBAC is enabled and get super admin role
    let userRoles: { role_id: string }[] = []
    const rbacEnabled = MedusaModule.isInstalled(Modules.RBAC)

    if (rbacEnabled) {
      const rbacService = container.resolve(Modules.RBAC)
      const superAdminRoles = await rbacService.listRbacRoles({
        id: RBAC_SUPER_ADMIN_ROLE_ID,
      })

      if (superAdminRoles.length > 0) {
        userRoles = [{ role_id: superAdminRoles[0].id }]
      }
    }

    if (invite) {
      const { result: invites } = await workflowService.run(
        "create-invite-step",
        {
          input: {
            invites: [
              {
                email,
                roles: userRoles,
              },
            ],
          },
        }
      )

      const createdInvite = invites[0]

      logger.info(
        `
      Invite token: ${createdInvite.token}
      Open the invite in Medusa Admin at: [your-admin-url]/invite?token=${createdInvite.token}`
      )
    } else {
      if (userRoles.length > 0) {
        logger.info("Assigning super admin role to user.")
      }

      const { result: users } = await workflowService.run(
        "create-users-workflow",
        {
          input: {
            users: [
              {
                email,
                roles: userRoles,
              },
            ],
          },
        }
      )

      const user = users[0]

      const { authIdentity, error } = await authService.register(provider, {
        body: {
          email,
          password,
        },
      })

      if (error) {
        logger.error(error)
        process.exit(1)
      }

      await authService.updateAuthIdentities({
        id: authIdentity!.id,
        app_metadata: {
          user_id: user.id,
        },
      })

      logger.info(
        "User created successfully." +
          (userRoles.length > 0 ? " Super admin role assigned." : "")
      )
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
