#! /usr/bin/env node

const { openacs } = require('./openacs-drive-api.js');

const argv = require('yargs')
  .alias('v','verbose').count('verbose')
  .options({
    'pg-monitor': {default:true},
    'limit': {default:99999}, // stop when error, if --no-stop, show error.
    'zero-auteurs': {default:false}, //
  }).argv;

const {verbose} = argv;
const instance_name = argv._[0];

if (!instance_name) {
  console.log(`
    missing instance_name.
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

  const drive1 = await drive.drives.get({
    instance_name,
    verbose
  })
  const {package_id, app_folder:folder_id, label, name} = drive1;
  console.log(`
    drive metadata
    istance_name: ${instance_name}
    package_id: ${package_id}
    folder_id: ${folder_id}
    label: ${label}
    name: ${name}
    `)

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
    console.log(`[${item_id}:${revision_id}] ${title}`)
  })

  console.log(`disconnecting...`);
  await openacs.disconnect();
  console.log(`disconnected -exit- Ok.`)
}

main().catch(console.error)
