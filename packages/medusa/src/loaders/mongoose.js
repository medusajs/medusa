import mongoose from "mongoose"
import config from "../config"

export default async ({ container }) => {
  const logger = container.resolve("logger")

  mongoose.connection.on("error", err => {
    logger.error(err)
  })

  return mongoose
    .connect(config.databaseURL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .catch(err => {
      logger.error(err)
    })
}
