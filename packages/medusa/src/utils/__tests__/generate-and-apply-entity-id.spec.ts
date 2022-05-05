import { generateAndApplyEntityId } from "../generate-and-apply-entity-id"
import { Entity, PrimaryColumn } from "typeorm"

@Entity()
class GenerateIdSpecEntity {
  @PrimaryColumn()
  id: string
}

describe("generateAndApplyEntityId", () => {
  it('should return false if nothing happened', () => {
    const entity = new GenerateIdSpecEntity()
    entity.id = "fakeId"

    const actionPerformed = generateAndApplyEntityId(entity, "id", "prefix")
    expect(actionPerformed).toBe(false)
  })

  it('should update the target id column on the entity with the expected generated id', () => {
    const entity = new GenerateIdSpecEntity()

    const actionPerformed = generateAndApplyEntityId(entity, "id", "prefix")
    expect(actionPerformed).toBeUndefined()
    expect(entity.id).toEqual(expect.stringMatching(/prefix_*/))
  })
})
