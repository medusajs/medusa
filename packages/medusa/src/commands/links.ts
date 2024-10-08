import syncLinksCmd from "./db/sync-links"

const main = async function (argv) {
  if (argv.action !== "sync") {
    return process.exit()
  }
  await syncLinksCmd(argv)
}

export default main
