#!/usr/bin/env node

/**
 * Migration Script: Assign Super Admin Role to All Admin Users
 *
 * This script assigns the pre-created super admin role
 * to all existing admin users in your Medusa instance.
 *
 * Usage: npx tsx packages/medusa/src/migration-scripts/create-super-admin-role.ts
 */

import { assignRolesWorkflow } from "@medusajs/core-flows"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  Modules,
  RBAC_SUPER_ADMIN_ROLE_ID,
} from "@medusajs/framework/utils"

interface User {
  id: string
  email?: string
  [key: string]: any
}

const PAGE_SIZE = 100

/**
 * Ids of the users that already hold the super admin role.
 */
async function listAssignedUserIds(
  rbacModuleService: any
): Promise<Set<string>> {
  const assigned = new Set<string>()
  let skip = 0

  while (true) {
    const page: { reference_id: string }[] =
      await rbacModuleService.listRbacRoleAssignments(
        { role_id: RBAC_SUPER_ADMIN_ROLE_ID, reference: "user" },
        { take: PAGE_SIZE, skip }
      )

    for (const assignment of page) {
      assigned.add(assignment.reference_id)
    }

    if (page.length < PAGE_SIZE) {
      return assigned
    }
    skip += PAGE_SIZE
  }
}

async function assignSuperAdminRoleToUsers(container: any): Promise<void> {
  try {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    logger.info("Starting super admin role assignment script...")

    const userModuleService = container.resolve(Modules.USER)
    const rbacModuleService = container.resolve(Modules.RBAC)

    logger.info("Looking for super admin role...")

    // Get the pre-created super admin role
    let superAdminRole: any
    try {
      const existingRoles = await rbacModuleService.listRbacRoles({
        id: RBAC_SUPER_ADMIN_ROLE_ID,
      })

      if (existingRoles.length) {
        superAdminRole = existingRoles[0]
        logger.info(
          `Found super admin role: ${superAdminRole.name} (${superAdminRole.id})`
        )
      } else {
        throw new Error(
          "Super admin role not found. Please ensure RBAC module is loaded."
        )
      }
    } catch (error) {
      logger.error(
        "Could not find super admin role. Please ensure RBAC module is loaded.",
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
          "Super admin role has no policies assigned. This might indicate an issue with the migration."
        )
      } else {
        logger.info(
          `Super admin role has ${rolePolicies.length} policies assigned`
        )
      }
    } catch (error) {
      logger.warn("Could not verify role policies:", error)
    }

    logger.info("Assigning super admin role to all users...")

    const alreadyAssigned = await listAssignedUserIds(rbacModuleService)

    let assignedCount = 0
    let skippedCount = 0
    let totalUsers = 0
    let skip = 0

    while (true) {
      const users: User[] = await userModuleService.listUsers(
        {},
        { take: PAGE_SIZE, skip }
      )
      totalUsers += users.length

      const assignments = users
        .filter((user) => !alreadyAssigned.has(user.id))
        .map((user) => ({
          role_id: superAdminRole.id,
          reference: Modules.USER,
          reference_id: user.id,
        }))

      const skippedInPage = users.length - assignments.length
      skippedCount += skippedInPage

      if (assignments.length) {
        await assignRolesWorkflow(container).run({ input: { assignments } })
        assignedCount += assignments.length
        logger.info(
          `  Assigned super admin role to users: ${assignments
            .map((assignment) => assignment.reference_id)
            .join(", ")}`
        )
      }

      logger.info(
        `Processed ${users.length} users (offset ${skip}): ${assignments.length} to assign, ${skippedInPage} already assigned`
      )

      if (users.length < PAGE_SIZE) {
        break
      }
      skip += PAGE_SIZE
    }

    if (!totalUsers) {
      logger.info("No users found. Exiting.")
      return
    }

    logger.info(
      `Super admin role: ${assignedCount} assigned, ${skippedCount} already assigned (${totalUsers} users total)`
    )
  } catch (error: any) {
    console.error("\nFatal error:", error.message)
    console.error("Stack trace:", error.stack)

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
    logger.info("Required modules (USER, AUTH, RBAC) not installed. Skipping.")
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
  isDisabled: () => !MedusaModule.isInstalled(Modules.RBAC),
})
