import dotenv from "dotenv"
import { createConnection } from "typeorm"
import { default as Logger } from "../loaders/logger"
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
  maxQueryExecutionTime: 5000,
  extra: {
    statement_timeout: 5000,
    idle_in_transaction_session_timeout: 5000,
  },
}

const run = async function ({ typeormConfig }) {
  const connection = await createConnection(typeormConfig)
  console.log(connection.options)

  const queryRunner = connection.createQueryRunner()
  await queryRunner.connect()

  try {
    await queryRunner.startTransaction()

    const result = await queryRunner.query(`select * from product`)

    await new Promise((resolve) =>
      setTimeout(() => resolve(console.log("test")), 10000)
    )

    await queryRunner.commitTransaction()
    return result
  } catch (error) {
    console.log(error)
    throw error
  } finally {
    await queryRunner.release()
  }
}
run({ typeormConfig })
  .then(() => {
    Logger.info("Test run successfull")
    process.exit()
  })
  .catch((err) => console.log(err))

export default run
