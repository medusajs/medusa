async function testAdmin() {
  console.log('Fetching http://localhost:9000/app HTML...')
  const res = await fetch('http://localhost:9000/app')
  const html = await res.text()
  console.log('HTML status:', res.status)
  console.log('HTML Content:\n', html)

  // Find all script tags
  const regex = /<script\b[^>]*src="([^"]*)"[^>]*>/gi
  let match
  const scripts: string[] = []
  while ((match = regex.exec(html)) !== null) {
    scripts.push(match[1])
  }

  // Also check inline script imports
  const moduleImports = [...html.matchAll(/from\s+["']([^"']+)["']/g)].map(m => m[1])
  const directImports = [...html.matchAll(/import\s+["']([^"']+)["']/g)].map(m => m[1])
  const allUrls = [...new Set([...scripts, ...moduleImports, ...directImports])]

  console.log('\nFound asset URLs:', allUrls)

  for (const src of allUrls) {
    const scriptUrl = src.startsWith('http')
      ? src
      : 'http://localhost:9000' + (src.startsWith('/') ? src : '/' + src)
    try {
      const sRes = await fetch(scriptUrl)
      console.log(`URL: ${scriptUrl} -> Status: ${sRes.status} (${sRes.headers.get('content-type')})`)
      if (!sRes.ok) {
        const errText = await sRes.text()
        console.error('  ERROR body:', errText.slice(0, 300))
      } else {
        const text = await sRes.text()
        console.log(`  Size: ${text.length} bytes`)
      }
    } catch (e: any) {
      console.error(`Failed to fetch ${scriptUrl}:`, e.message)
    }
  }
}

testAdmin()
