const { User, Invite } = require("@medusajs/medusa")

module.exports = async (connection, data = {}) => {
  const manager = connection.manager

  const memberUser = await manager.create(User, {
    id: "member-user",
    role: "member",
    email: "member@test.com",
    first_name: "member",
    last_name: "user",
  })
  await manager.save(memberUser)

  const memberInvite = await manager.create(Invite, {
    id: "memberInvite",
    user_email: "invite-member@test.com",
    role: "member",
    accepted: false,
  })
  await manager.save(memberInvite)

  const adminInvite = await manager.create(Invite, {
    id: "adminInvite",
    user_email: "invite-admin@test.com",
    role: "admin",
    accepted: false,
  })
  await manager.save(adminInvite)
}
