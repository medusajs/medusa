import { BeforeInsert, Column } from "typeorm"

import { BaseEntity } from "../interfaces"
import { resolveDbType } from "../utils/db-aware-column"
import { generateEntityId } from "../utils"
import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import PublishableAPIKeysFeatureFlag from "../loaders/feature-flags/publishable-api-keys"

@FeatureFlagEntity(PublishableAPIKeysFeatureFlag.key)
export class PublishableApiKey extends BaseEntity {
  @Column({ type: "varchar", nullable: true })
  created_by: string | null

  @Column({ type: "varchar", nullable: true })
  revoked_by: string | null

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  revoked_at: Date | null

  @Column()
  title: string

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pk")
  }
}

/**
 * @schema PublishableApiKey
 * title: "Publishable API key"
 * description: "Publishable API key defines scopes (i.e. resources) that are available within a request."
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The key's ID
 *     example: pk_01G1G5V27GYX4QXNARRQCW1N8T
 *   created_by:
 *    type: string
 *    description: "The unique identifier of the user that created the key."
 *    example: usr_01G1G5V26F5TB3GPAPNJ8X1S3V
 *   created_by_user:
 *    description: A user object. Available if the relation `created_by_user` is expanded.
 *    type: object
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   revoked_by:
 *     type: string
 *     description: "The unique identifier of the user that revoked the key."
 *     example: usr_01G1G5V26F5TB3GPAPNJ8X1S3V
 *   revoked_by_user:
 *     description: A user object. Available if the relation `revoked_by_user` is expanded.
 *     type: object
 *   revoked_at:
 *     type: string
 *     description: "The date with timezone at which the key was revoked."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 */
