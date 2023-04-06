const { User, Invite } = require("@medusajs/medusa")
import jwt from "jsonwebtoken"

const generateToken = (data) => {
  return jwt.sign(data, "test", {
    expiresIn: "7d",
  })
}

const expires_at = new Date()

expires_at.setDate(expires_at.getDate() + 8)

module.exports = async (dataSource, data = {}) => {
  const manager = dataSource.manager

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
    token: generateToken({
      invite_id: "memberInvite",
      role: "member",
      user_email: "invite-member@test.com",
    }),
    accepted: false,
    expires_at: expires_at,
  })
  await manager.save(memberInvite)

  const adminInvite = await manager.create(Invite, {
    id: "adminInvite",
    user_email: "invite-admin@test.com",
    role: "admin",
    accepted: false,
    token: generateToken({
      invite_id: "adminInvite",
      role: "admin",
      user_email: "invite-admin@test.com",
    }),
    expires_at: expires_at,
  })
  await manager.save(adminInvite)
}
