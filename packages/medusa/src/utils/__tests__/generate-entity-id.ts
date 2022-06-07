import { generateEntityId } from "../generate-entity-id"
import { Entity, PrimaryColumn } from "typeorm"

@Entity()
class GenerateIdSpecEntity {
  @PrimaryColumn()
  id: string
}

describe("generateAndApplyEntityId", () => {
  it('should return the id if already set', () => {
    const entity = new GenerateIdSpecEntity()
    entity.id = "fakeId"

    const generatedId = generateEntityId(entity.id, "prefix")
    expect(generatedId).toBe(entity.id)
  })

  it('should return the new generated id if not set already', () => {
    const entity = new GenerateIdSpecEntity()

    entity.id = generateEntityId(entity.id, "prefix")
    expect(entity.id).toBeTruthy()
    expect(entity.id).toEqual(expect.stringMatching(/prefix_*/))
  })
})
