async function run() {
  const releaseName = process.argv.slice(2)[0]
  const releaseUrl = process.argv.slice(2)[1]

  const message = `
    Medusa ${releaseName} is out! 🚢 @here
    
    Check out the changes here: ${releaseUrl}`

  console.log(message)
}

run()
