import { createConnection } from "typeorm"

const t = async function({ port, directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  const { configModule } = getConfigFile(directory, `medusa-config`)
  const { plugins } = configModule

  const resolved = plugins.map(plugin => {
    if (_.isString(plugin)) {
      return resolvePlugin(plugin)
    }

    const details = resolvePlugin(plugin.resolve)
    details.options = plugin.options

    return details
  })

  resolved.push({
    resolve: `${directory}/dist`,
    name: `project-plugin`,
    id: createPluginId(`project-plugin`),
    options: {},
    version: createFileContentHash(process.cwd(), `**`),
  })

  const migrationDirs = []
  const coreMigrations = path.resolve(__dirname, "../migrations")

  migrationDirs.push(`${coreMigrations}/*.js`)

  for (const p of resolved) {
    const exists = existsSync(`${p.resolve}/migrations`)
    if (exists) {
      migrationDirs.push(`${p.resolve}/migrations/*.js`)
    }
  }

  const connection = await createConnection({
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    migrations: migrationDirs,
    logging: true,
  })

  if (args[0] === "run") {
    await connection.runMigrations()
    await connection.close()
    Logger.info("Migrations completed.")
    process.exit()
  } else if (args[0] === "show") {
    const unapplied = await connection.showMigrations()
    await connection.close()
    process.exit(unapplied ? 1 : 0)
  }
}

export default t
