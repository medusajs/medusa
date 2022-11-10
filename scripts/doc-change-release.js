#!/usr/bin/env node

const { Octokit } = require("@octokit/core");
const fs = require('fs');
const path = require('path');

const shouldExpire = process.argv.indexOf('--expire') !== -1;
const octokit = new Octokit({
  auth: process.env.GH_TOKEN
});

async function main () {
  let announcement = {};

  if (shouldExpire) {
    //check if the file was last updated 6 days ago
    try {
      const commitResponse = await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: 'medusajs',
        repo: 'medusa',
        path: path.join('www', 'docs', 'announcement.json'),
        per_page: 1
      })
      
      if (commitResponse.data.length && dateDiffInDays(new Date(commitResponse.data[0].commit.committer.date), new Date()) < 6) {
        console.log("File was edited less than 6 days ago. Expiry canceled.");
        return;
      }
    } catch (e) {
      //continue as if file doesn't exist
    }
  } else {
    //retrieve the latest release
    const response = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
      owner: 'medusajs',
      repo: 'medusa'
    });

    const version = response.data.tag_name;

    //add new announcement
    announcement = {
      id: response.data.html_url,
      content: `${version} is out`,
      isCloseable: true,
    }
  }

  //write new config file
  fs.writeFileSync(path.join(__dirname, '..', 'www', 'docs', 'announcement.json'), JSON.stringify(announcement));
  console.log(`Announcement Bar has been ${shouldExpire ? 'removed' : 'added'}`);
}

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

main();