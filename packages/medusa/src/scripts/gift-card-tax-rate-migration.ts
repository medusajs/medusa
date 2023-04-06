import dotenv from "dotenv"
import { createConnection, IsNull } from "typeorm"
import Logger from "../loaders/logger"
import { GiftCard } from "../models/gift-card"
import { typeormConfig } from "./db-config"

dotenv.config()

const BATCH_SIZE = 1000
const migrationName = 'gift-card-tax-rate-migration'

Logger.info(`typeormConfig: ${JSON.stringify(typeormConfig)}`)

const migrate = async function ({ typeormConfig }): Promise<void> {
  const connection = await createConnection(typeormConfig)

  await connection.transaction(async (manager) => {
    let offset = 0

    // Get all the GiftCards where the gift_card.tax_rate is null
    const giftCardsCount = await manager
      .createQueryBuilder()
      .withDeleted()
      .from(GiftCard, "gc")
      .select("gc.id")
      .where("gc.tax_rate IS NULL")
      .getCount()

    const totalBatches = Math.ceil(giftCardsCount / BATCH_SIZE)

    if (totalBatches == 0) {
      Logger.info(`${migrationName}: No records to update, skipping migration!`)

      return
    }

    Logger.info(`${migrationName}: Running migration for ${giftCardsCount} GiftCards`)
    Logger.info(`${migrationName}: Running migration in ${totalBatches} batch(es) of ${BATCH_SIZE}`)

    for (let batch = 1; batch <= totalBatches; batch++) {
      Logger.info(`${migrationName}: Starting batch ${batch} of ${totalBatches}`)

      // Get all the GiftCards and its region where the gift_card.tax_rate is null
      const giftCardRegionRecords = await manager
        .createQueryBuilder()
        .withDeleted()
        .from(GiftCard, "gc")
        .select("gc.id, gc.region_id, gc.tax_rate, r.tax_rate as region_tax_rate")
        .innerJoin("region", "r", "gc.region_id = r.id")
        .where("gc.tax_rate IS NULL")
        .limit(BATCH_SIZE)
        .offset(offset)
        .getRawMany()

      // Loop through each gift card record and update the value of gift_card.tax_rate
      // with region.tax_rate value
      giftCardRegionRecords.forEach(async (gcr) => {
        await manager
          .createQueryBuilder()
          .update(GiftCard)
          .set({ tax_rate: gcr.region_tax_rate })
          .where("id = :id", { id: gcr.id })
          .execute()
      })

      offset += BATCH_SIZE

      Logger.info(`${migrationName}: Finished batch ${batch} of ${totalBatches}`)
    }

    const recordsFailedToBackfill = await manager
      .createQueryBuilder()
      .withDeleted()
      .from(GiftCard, "gc")
      .select("gc.id")
      .where("gc.tax_rate IS NULL")
      .getCount()

    if (recordsFailedToBackfill == 0) {
      Logger.info(`${migrationName}: successfully ran for ${giftCardsCount} GiftCards`)
    } else {
      Logger.info(`${migrationName}: ${recordsFailedToBackfill} GiftCards have no tax_rate set`)
      Logger.info(`${migrationName}: 1. Check if all GiftCards have a region associated with it`)
      Logger.info(`${migrationName}: If not, they need to be associated with a region & re-run migration`)
      Logger.info(`${migrationName}: 2. Check if regions have a tax_rate added to it`)
      Logger.info(`${migrationName}: If regions intentionally have no tax_rate, this can be ignored`)
      Logger.info(`${migrationName}: If not, add a tax_rate to region & re-run migration`)
    }
  })
}

migrate({ typeormConfig })
  .then(() => {
    Logger.info("Database migration completed")
    process.exit()
  }).catch((err) => {
    Logger.error(`Database migration failed - ${JSON.stringify(err)}`)
    process.exit(1)
  })

export default migrate
