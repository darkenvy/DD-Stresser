# DD-Stresser
DD will be run from /dev/zero into a file (which will automatically be cleaned up). The blocksize will increment to the maximum size specified. At the very end, the fastest times and blocksizes will be reported. This is useful for finding out the most efficient blocksizes and getting performance estimates purely on read/write capabilities.

### How to run
* have node installed
* `npm install` (or `yarn install`)
* `node index.js --help` to see usage options.
* for example: `node index.js --maxSize 1mb --maxBlocksize 128mb`
