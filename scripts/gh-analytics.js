const { Octokit } = require("@octokit/core");
const Analytics = require('analytics-node');
const uniqid = require('uniqid'); 

async function retrieveAnalytics () {
  const octokit = new Octokit({
    auth: process.env.GH_TOKEN
  })
  const analytics = new Analytics(process.env.SEGMENT_API_KEY);
  const date = new Date();
  
  console.log("Retrieving referrals...")
  const referrersResponse = await octokit.request('GET /repos/{owner}/{repo}/traffic/popular/referrers', {
    owner: 'medusajs',
    repo: 'medusa'
  })
  console.log(`Pushing ${referrersResponse.data.length} referrers...`);
  referrersResponse.data.forEach((ref) => {
    if (!process.env.DEBUG) {
      analytics.page({
        anonymousId: uniqid(),
        category: 'referrals',
        properties: {
          title: ref.referrer,
          count: ref.uniques
        },
        timestamp: date
      })
    }
  })
  
  console.log("Retrieving popular paths...")
  const pathsResponse = await octokit.request('GET /repos/{owner}/{repo}/traffic/popular/paths', {
    owner: 'medusajs',
    repo: 'medusa'
  })
  console.log(`Pushing ${pathsResponse.data.length} paths...`);
  
  pathsResponse.data.forEach((path) => {
    if (!process.env.DEBUG) {
      analytics.page({
        anonymousId: uniqid(),
        category: 'popular_paths',
        properties: {
          title: path.title,
          path: path.path,
          url: `https://github.com/medusajs/medusa${path.path}`,
          count: path.uniques
        },
        timestamp: date
      })
    }
  })
}

retrieveAnalytics();