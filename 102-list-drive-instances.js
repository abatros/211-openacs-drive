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

  const drives = await drive.drives.list()
  drives.items.forEach(drive =>{
    const {folder_id, package_id, instance_name, name} = drive;
    console.log(`-- folder_id:${folder_id} package_id:${package_id} "${instance_name}" app-folder:<${name}>`)
  })

  console.log(`disconnecting...`);
  await openacs.disconnect();
  console.log(`disconnected -exit- Ok.`)
}

main().catch(console.error)
