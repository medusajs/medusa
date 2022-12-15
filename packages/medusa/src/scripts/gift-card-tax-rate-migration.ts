import dotenv from "dotenv"
import { createConnection } from "typeorm"
import Logger from "../loaders/logger"
import { GiftCard } from "../models/gift-card"

dotenv.config()

const typeormConfig = {
  type: process.env.TYPEORM_CONNECTION,
  url: process.env.TYPEORM_URL,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  migrations: [process.env.TYPEORM_MIGRATIONS as string],
  entities: [process.env.TYPEORM_ENTITIES],
  logging: true,
}

const migrate = async function ({ typeormConfig }): Promise<void> {
  const connection = await createConnection(typeormConfig)
  const BATCH_SIZE = 1000
  let giftCardsCount = 0

  await connection.transaction(async (manager) => {
    let offset = 0

    // Get all the GiftCards where the gift_card.tax_rate is null
    giftCardsCount = await manager
      .createQueryBuilder()
      .from(GiftCard, "gc")
      .select("gc.id")
      .where("gc.tax_rate = :value", { value: null })
      .getCount()

    const totalBatches = Math.ceil(giftCardsCount / BATCH_SIZE)

    if (totalBatches == 0) {
      Logger.info(`GiftCard.tax_rate Backfill: No records to update, skipping migration!`)

      return
    }

    Logger.info(`GiftCard.tax_rate Backfill: Running migration for ${giftCardsCount} GiftCards`)
    Logger.info(`GiftCard.tax_rate Backfill: Running migration in ${totalBatches} batch(es) of ${BATCH_SIZE}`)

    for (let batch = 1; batch <= totalBatches; batch++) {
      Logger.info(`GiftCard.tax_rate Backfill: Starting batch ${batch} of ${totalBatches}`)

      // Get all the GiftCards and its region where the gift_card.tax_rate is null
      const giftCardRegionRecords = await manager
        .createQueryBuilder()
        .from(GiftCard, "gc")
        .select("gc.id, gc.region_id, gc.tax_rate, r.tax_rate as region_tax_rate")
        .innerJoin("region", "r", "gc.region_id = r.id")
        .where("gc.tax_rate = :value", { value: null })
        .limit(BATCH_SIZE)
        .offset(offset)
        .getRawMany()

      // Loop through each gift card record and update the value of gift_card.tax_rate
      // with region.tax_rate value
      giftCardRegionRecords.forEach((gcr) => {
        await manager
          .createQueryBuilder()
          .update(GiftCard)
          .set({ tax_rate: gcr.region_tax_rate })
          .where("id = :id", { id: gcr.id })
          .execute()
      })

      offset += BATCH_SIZE

      Logger.info(`GiftCard.tax_rate Backfill: Finished batch ${batch} of ${totalBatches}`)
    }
  })

  const recordsFailedToBackfill = await manager
    .createQueryBuilder()
    .from(GiftCard, "gc")
    .select("gc.id")
    .where("gc.tax_rate = :value", { value: null })
    .getCount()

  if (recordsFailedToBackfill == 0) {
    Logger.info(`GiftCard.tax_rate Backfill: successfully ran for ${giftCardsCount} GiftCards`)
  } else {
    Logger.info(`GiftCard.tax_rate Backfill: ${recordsFailedToBackfill} GiftCards have no tax_rate set`)
    Logger.info(`1. Check if all GiftCards have a region associated with it`)
    Logger.info(`If not, they need to be associated with a region & re-run migration`)
    Logger.info(`2. Check if regions have a tax_rate added for it`)
    Logger.info(`If regions intentionally have no tax_rate, this can be ignored`)
    Logger.info(`If not, add a tax_rate to region & re-run migration`)
  }

  process.exit()
}

migrate({ typeormConfig })
  .then(() => {
    Logger.info("Database migration completed")
    process.exit()
  })
  .catch((err) => console.log(err))

export default migrate
