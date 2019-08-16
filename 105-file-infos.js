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
const item_id = argv._[0];

if (!item_id) {
  console.log(`
    missing item_id (fileId)
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

  const file = await drive.files.get({
    item_id
  })
  console.log(`file:`,file);


  const revisions = await drive.revisions.list({
    item_id
  });
  console.log(`revisions:`,revisions);


  console.log(`disconnecting...`);
  await openacs.disconnect();
  console.log(`disconnected -exit- Ok.`)
}

main().catch(console.error)
