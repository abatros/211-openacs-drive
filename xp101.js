#! /usr/bin/env node

const { openacs } = require('./openacs-drive-api.js');

const argv = require('yargs')
  .alias('v','verbose').count('verbose')
  .alias('p','phase') // 1:get-url, 2:create-token 3:read-emails
  .boolean('commit')
  .options({
    'pg-monitor': {default:true},
    'limit': {default:99999}, // stop when error, if --no-stop, show error.
    'zero-auteurs': {default:false}, //
  }).argv;

const {verbose, phase} = argv;

async function main() {
  const drive = await openacs.drive({
    version: 'v3',
  //  auth: oAuth2Client,
    password: process.env.PGPASSWORD,
    verbose
  });

  if (verbose) {
    const drives = await drive.drives.list()
    .then(retv =>{
      console.log(`retv:`,retv)
    })
    .catch(err =>{
      console.log(`err:`,err)
    })
  }


  const drive1 = await drive.drives.get({
    driveId: 'museum-june-2019',
    verbose
  })
  const {package_id, app_folder, label} = drive1;
  //console.log(`drive1:`,drive1)

  const dir = await drive.files.list({
    driveId: app_folder,
    maxResults: 9999,
    orderBy: 'item_id desc',
    pageToken: undefined,
    q: undefined,
    spaces: 'drive' // appDataFolder or photos...
  });


  const dir2 = dir.items.map(file =>{
    const {item_id, revision_id, name, title} =file;
    return {revision_id};
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
