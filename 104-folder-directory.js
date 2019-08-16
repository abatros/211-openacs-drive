#! /usr/bin/env node

const { openacs } = require('./openacs-drive-api.js');

const argv = require('yargs')
  .alias('v','verbose').count('verbose')
  .alias('d','folder_id')
  .boolean('commit')
  .options({
    'pg-monitor': {default:true},
    'limit': {default:99999}, // stop when error, if --no-stop, show error.
    'zero-auteurs': {default:false}, //
  }).argv;

const {verbose} = argv;
const folder_id = argv._[0];

if (!folder_id) {
  console.log(`
    missing folder_id (driveId)
    `)
  process.exit(-1)
}

async function main() {
  const drive = await openacs.drive({
    version: 'v3',
  //  auth: oAuth2Client,
    password: process.env.PGPASSWORD,
    verbose
  });

  const dir = await drive.files.list({
    folder_id,
    maxResults: 9999,
    orderBy: 'item_id desc',
    pageToken: undefined,
    q: undefined,
    spaces: 'drive' // appDataFolder or photos...
  });

  dir.items.forEach(file =>{
    const {item_id, revision_id, name, title} =file;
    console.log(`[${revision_id}] ${title}`)
  })

  console.log(`disconnecting...`);
  await openacs.disconnect();
  console.log(`disconnected -exit- Ok.`)
}

main().catch(console.error)
