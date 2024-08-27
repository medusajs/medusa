import syncLinks from "./db/sync-links"

const main = async function (argv) {
  if (argv.action !== "sync") {
    return process.exit()
  }
  await syncLinks(argv)
}

export default main
