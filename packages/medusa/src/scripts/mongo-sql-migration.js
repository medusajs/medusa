#!/usr/bin/env node

import path from "path"
import glob from "glob"
import mongo from "mongodb"
import chalk from "chalk"
import { QueryRunner, In, createConnection } from "typeorm"

import { getConfigFile, createRequireFromPath } from "medusa-core-utils"

import { Country } from "../models/country"
import { RegionRepository } from "../repositories/region"
import { ShippingProfileRepository } from "../repositories/shipping-profile"
import { ShippingOptionRepository } from "../repositories/shipping-option"

/**
 * Migrates Regions
 * @param {MongoDb} mongodb
 * @param {QueryRunner} queryRunner
 */
const migrateRegions = async (mongodb, queryRunner) => {
  const rcol = mongodb.collection("regions")
  const regCursor = rcol.find({})
  const regions = await regCursor.toArray()

  const countryRepository = queryRunner.manager.getRepository(Country)

  const regionRepository = queryRunner.manager.getCustomRepository(
    RegionRepository
  )

  for (const reg of regions) {
    await queryRunner.query(`DELETE FROM "region" WHERE name = '${reg.name}'`)

    const countries = await countryRepository.find({
      iso_2: In(reg.countries.map(c => c.toLowerCase())),
    })

    const newRegion = regionRepository.create({
      name: reg.name,
      currency_code: reg.currency_code.toLowerCase(),
      tax_rate: reg.tax_rate * 100,
      tax_code: reg.tax_code,
      countries,
    })
    newRegion.payment_providers = reg.payment_providers.map(p => ({
      id: p,
    }))
    newRegion.fulfillment_providers = reg.fulfillment_providers.map(p => ({
      id: p,
    }))

    await regionRepository.save(newRegion)
  }
}

/**
 * Migrates Shipping Options
 * @param {MongoDb} mongodb
 * @param {QueryRunner} queryRunner
 */
const migrateShippingOptions = async (mongodb, queryRunner) => {
  const col = mongodb.collection("shippingoptions")
  const cursor = col.find({})
  const options = await cursor.toArray()

  const rCol = mongodb.collection("regions")
  const rCursor = rCol.find({})
  const regions = await rCursor.toArray()

  const pCol = mongodb.collection("shippingprofiles")
  const pCursor = pCol.find({})
  const profiles = await pCursor.toArray()

  const regionRepository = queryRunner.manager.getCustomRepository(
    RegionRepository
  )
  const optionRepository = queryRunner.manager.getCustomRepository(
    ShippingOptionRepository
  )
  const profileRepo = queryRunner.manager.getCustomRepository(
    ShippingProfileRepository
  )

  const existing = await optionRepository.find({ relations: ["requirements"] })
  for (const e of existing) {
  }

  for (const option of options) {
    const mongoReg = regions.find(r => r._id.equals(option.region_id))
    const region = await regionRepository.findOne({ name: mongoReg.name })

    const mongoProfile = profiles.find(p => p._id.equals(option.profile_id))
    let profile
    if (mongoProfile.name === "default_shipping_profile") {
      profile = await profileRepo.findOne({ type: "default" })
    } else if ((mongoProfile.name = "default_gift_card_profile")) {
      profile = await profileRepo.findOne({ type: "gift_card" })
    }

    const newOption = optionRepository.create({
      name: option.name,
      region,
      profile,
      provider_id: option.provider_id,
      price_type: option.price.type,
      amount: option.price.amount * 100,
      is_return: !!option.is_return,
      data: option.data,
      requirements: option.requirements.map(r => ({
        type: r.type,
        amount: r.value * 100,
      })),
    })
    console.log(newOption)
    await optionRepository.save(newOption)
  }
}

const migrate = async () => {
  const root = path.resolve(".")
  const { configModule } = getConfigFile(root, "medusa-config")
  const { mongo_url, database_type, database_url } = configModule.projectConfig

  if (!mongo_url) {
    throw new Error(
      "Cannot run migration script without a mongo_url in medusa-config"
    )
  }

  if (!database_type || !database_url) {
    throw new Error(
      "Cannot run migration script without a database_type and database_url in medusa-config"
    )
  }

  const mPath = path.resolve(__dirname, "../models")

  console.log(chalk.blue("MONGO: Connecting to ", mongo_url))
  const client = await mongo.MongoClient.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = client.db(client.dbName)
  console.log(chalk.green("MONGO: Connecting created"))

  console.log(chalk.blue("SQL: Connecting to ", database_url))
  const sqlConnection = await createConnection({
    type: database_type,
    url: database_url,
    entities: [`${mPath}/*.js`],
    logging: true,
  })
  const queryRunner = sqlConnection.createQueryRunner()
  await queryRunner.connect()
  await queryRunner.startTransaction()
  console.log(chalk.green("SQL: Connecting created"))

  try {
    //await migrateRegions(db, queryRunner).then(() => {
    //  console.log(chalk.green("Regions migrated"))
    //})
    //
    await migrateShippingOptions(db, queryRunner).then(() => {
      console.log(chalk.green("Shipping Options Migrated"))
    })

    await queryRunner.commitTransaction()
  } catch (err) {
    await queryRunner.rollbackTransaction()
    throw err
  } finally {
    await queryRunner.release()
  }
}

migrate()
  .then(() => {
    console.log("Migration complete")
    process.exit()
  })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
