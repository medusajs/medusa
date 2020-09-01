import mongoose from "mongoose"

export default async ({ container, configModule }) => {
  const logger = container.resolve("logger")

  mongoose.connection.on("error", err => {
    logger.error(err)
  })

  return mongoose
    .connect(configModule.projectConfig.mongo_url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .catch(err => {
      logger.error(err)
    })
}
