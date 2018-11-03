const filesizeParser = require('filesize-parser');
const yargs = require("yargs");
const Disk = require('./disks');

yargs.help('help')
  .usage(`Usage: $0 --maxSize [10mb] --maxBlocksize [1mb]

    [] signifies optional parameters.
    defaults to 10mb for maxSize and 1mb for maxBlocksize if not specified
    blocksizes greater than 1mb may not be performant
  `)
  .showHelpOnFail(true);

const argv = yargs.argv;
const results = {};
const blockSizes = [
  '1k',
  '2k',
  '4k',
  '8k',
  '16k',
  '32k',
  '64k',
  '128k',
  '256k',
  '512k',
  '1mb',
  '2mb',
  '4mb',
  '8mb',
  '16mb',
  '32mb',
  '64mb',
  '128mb',
  '256mb',
  '512mb',
  '1gb',
  '2gb',
  '4gb',
  '8gb',
];

function printBestResults() {
  let bestWrite = { bs: null, speed: 0 };
  let bestRead = { bs: null, speed: 0 };

  Object.keys(results).forEach(bs => {
    const result = results[bs];
    if (!result || result.length < 2) return;
    const write = result[0];
    const read = result[1];

    if (write > bestWrite.speed) bestWrite = { bs, speed: write };
    if (read > bestRead.speed) bestRead = { bs, speed: read };
  });

  const formattedWriteSpeed = new Disk().format(bestWrite.speed);
  const formattedReadSpeed = new Disk().format(bestRead.speed);

  console.log('+--------------------------+');
  console.log('| Results: Best Read/Write |');
  console.log('+--------------------------+');
  console.log(`${bestWrite.bs} BlockSize: ${formattedWriteSpeed}`);
  console.log(`${bestRead.bs} BlockSize: ${formattedReadSpeed}`);
}


function main() {
  const maxSize = argv.maxSize || '10mb';
  const maxBlocksize = argv.maxBlocksize || '1mb';
  console.log('--------------------------------------------------');
  console.log('Beginning tests with the max filesize of', maxSize);
  console.log('And a max blocksize of', maxBlocksize);
  console.log('--------------------------------------------------');
  
  blockSizes.forEach(blockSize => {
    if (filesizeParser(blockSize) > filesizeParser(maxBlocksize)) return; // would be better as a generator*()
    const disk = new Disk({ blockSize, maxSize });
    const result = disk.test();
    results[blockSize] = result;
  });

  printBestResults();
  
}

main();
