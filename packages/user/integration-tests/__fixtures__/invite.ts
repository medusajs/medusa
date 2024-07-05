import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Invite } from "@models"
import { CreateInviteDTO } from "../../../types/dist"

export const createInvites = async (
  manager: SqlEntityManager,
  inviteData: (CreateInviteDTO & { id?: string })[]
) => {
  const invites: Invite[] = []

  for (const invite of inviteData) {
    const inv = manager.create(Invite, invite)
    invites.push(inv)
  }

  await manager.persistAndFlush(invites)
}
