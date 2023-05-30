type ConnectionStringOptions = {
  user?: string
  password?: string
  host?: string
  db: string
}

export default ({ user, password, host, db }: ConnectionStringOptions) => {
  let connection = `postgres://`
  if (user) {
    connection += user
  }

  if (password) {
    connection += `:${password}`
  }

  if (user || password) {
    connection += "@"
  }

  connection += `${host}/${db}`

  return connection
}
