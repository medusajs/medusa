import { RemoteQuery } from "../remote-query"

describe("Remote query", () => {
  it("should properly handle fields and relations transformation", () => {
    const expand = {
      fields: ["name", "age"],
      expands: {
        friend: {
          fields: ["name"],
          expands: {
            ball: {
              fields: ["*"],
            },
          },
        },
      },
    }

    const result = RemoteQuery.getAllFieldsAndRelations(expand)

    expect(result).toEqual({
      select: ["name", "age", "friend.name"],
      relations: ["friend", "friend.ball"],
      args: {
        "": undefined,
        friend: undefined,
        "friend.ball": undefined,
      },
    })
  })
})
