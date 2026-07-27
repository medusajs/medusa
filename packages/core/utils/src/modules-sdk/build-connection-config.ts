/**
 * Build the knex connection config object.
 *
 * When dynamicPassword is provided, we parse the URL into discrete fields
 * instead of passing connectionString. This is required because pg's
 * ConnectionParameters does:
 *
 *   Object.assign({}, config, parse(config.connectionString))
 *
 * The parsed URL always includes a `password` key (empty string for passwordless
 * URLs), which overwrites any password function via Object.assign. By passing
 * discrete fields without connectionString, the password function is preserved
 * and pg invokes it on every new connection.
 */
export function buildConnectionConfig(
  clientUrl: string,
  ssl: any,
  driverOptions: any,
  connectionTimeoutMillis: number,
  keepAlive: boolean,
  keepAliveInitialDelayMillis: number
) {
  const sharedConfig = {
    ssl: ssl as any,
    idle_in_transaction_session_timeout:
      (driverOptions?.idle_in_transaction_session_timeout as number) ??
      undefined,
    connectionTimeoutMillis: connectionTimeoutMillis as number,
    keepAlive: keepAlive as boolean,
    keepAliveInitialDelayMillis: keepAliveInitialDelayMillis as number,
    ...(driverOptions?.expirationChecker
      ? { expirationChecker: driverOptions.expirationChecker }
      : {}),
  }

  if (driverOptions?.dynamicPassword) {
    // Parse URL into discrete fields so pg does not clobber the password function
    const parsed = new URL(clientUrl)
    return {
      host: parsed.hostname,
      port: Number(parsed.port) || 5432,
      user: decodeURIComponent(parsed.username),
      database: parsed.pathname.slice(1),
      password: driverOptions.dynamicPassword,
      ...sharedConfig,
    }
  }

  return {
    connectionString: clientUrl,
    ...sharedConfig,
  }
}
