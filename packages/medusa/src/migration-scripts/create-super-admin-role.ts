#!/usr/bin/env node

/**
 * Migration Script: Assign Super Admin Role to All Admin Users
 *
 * This script assigns the pre-created super admin role
 * to all existing admin users in your Medusa instance.
 *
 * Usage: npx tsx packages/medusa/src/migration-scripts/create-super-admin-role.ts
 */

import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
  Modules,
} from "@medusajs/framework/utils"
import dotenv from "dotenv"

dotenv.config()

interface User {
  id: string
  email?: string
  [key: string]: any
}

async function assignSuperAdminRoleToUsers(container: any): Promise<void> {
  try {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    logger.info("🚀 Starting super admin role assignment script...")

    const userModuleService = container.resolve(Modules.USER)
    const rbacModuleService = container.resolve(Modules.RBAC)

    const users: User[] = await userModuleService.listUsers({})

    if (!users.length) {
      logger.info("⚠️  No users found. Exiting.")
      return
    }

    logger.info(`📊 Found ${users.length} users`)

    logger.info("\n👥 Users found:")
    users.forEach((user: User, index: number) => {
      logger.info(`  ${index + 1}. ${user.email || user.id} (${user.id})`)
    })

    logger.info("\n🔐 Looking for super admin role...")

    // Get the pre-created super admin role
    let superAdminRole: any
    try {
      const existingRoles = await rbacModuleService.listRbacRoles({
        id: "role_super_admin",
      })

      if (existingRoles.length) {
        superAdminRole = existingRoles[0]
        logger.info(
          `✅ Found super admin role: ${superAdminRole.name} (${superAdminRole.id})`
        )
      } else {
        throw new Error(
          "Super admin role not found. Please ensure RBAC module is loaded."
        )
      }
    } catch (error) {
      logger.error(
        "❌ Could not find super admin role. Please ensure RBAC module is loaded.",
        error
      )
      throw error
    }

    // Verify the role has the wildcard policy
    try {
      const rolePolicies = await rbacModuleService.listRbacRolePolicies({
        role_id: superAdminRole.id,
      })

      if (!rolePolicies.length) {
        logger.warn(
          "⚠️  Super admin role has no policies assigned. This might indicate an issue with the migration."
        )
      } else {
        logger.info(
          `✅ Super admin role has ${rolePolicies.length} policies assigned`
        )
      }
    } catch (error) {
      logger.warn("⚠️  Could not verify role policies:", error)
    }

    logger.info("👥 Assigning super admin role to all users...")

    let successCount = 0
    let errorCount = 0

    const link = container.resolve(ContainerRegistrationKeys.LINK)

    for (const user of users) {
      try {
        logger.info(`  🔄 Processing user: ${user.email || user.id}`)

        // Link the user to the super admin role
        await link.create({
          [Modules.USER]: {
            user_id: user.id,
          },
          [Modules.RBAC]: {
            rbac_role_id: superAdminRole.id,
          },
        })

        logger.info(`    ✅ Assigned super admin role to user`)
        successCount++
      } catch (error: any) {
        console.error(
          `    ❌ Failed to assign role to user ${user.id}:`,
          error.message
        )
        errorCount++
      }
    }

    logger.info(`  ✅ Successfully assigned role: ${successCount} users`)

    if (errorCount > 0) {
      logger.info(`  ❌ Failed to assign role: ${errorCount} users`)
    }

    if (successCount > 0) {
      logger.log("\n🎉 Super admin role assignment completed successfully!")

      const totalAssigned = successCount
      logger.info(
        `Super admin role is now assigned to ${totalAssigned} out of ${users.length} users`
      )

      if (successCount > 0) {
        logger.info("\n📝 Next steps:")
        logger.info("  1. Restart your Medusa server")
        logger.info("  2. Test the permissions by logging in as an admin user")
        logger.info(
          "  3. Verify that the user has access to all admin endpoints"
        )
      }
    }
  } catch (error: any) {
    console.error("\n❌ Fatal error:", error.message)
    console.error("🔍 Stack trace:", error.stack)

    throw error
  }
}

export default async function createSuperAdminRole({ container }: ExecArgs) {
  if (
    !MedusaModule.isInstalled(Modules.USER) ||
    !MedusaModule.isInstalled(Modules.AUTH) ||
    !MedusaModule.isInstalled(Modules.RBAC)
  ) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    logger.info(
      "⚠️  Required modules (USER, AUTH, RBAC) not installed. Skipping."
    )
    return
  }

  try {
    await assignSuperAdminRoleToUsers(container)
  } catch (error) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    logger.error("Failed to assign super admin role:", error)
    throw error
  }
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("rbac"),
})
