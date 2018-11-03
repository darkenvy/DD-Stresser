const shell = require('shelljs');
const filesize = require('filesize');
const filesizeParser = require('filesize-parser');
const fs = require('fs');
const path = require('path');

class Disk {
  constructor(params) {
    this.silent = (params && params.silent) || false;
    this.testFilePath = path.join(__dirname, 'zero.img');
    this.maxSize = 1024;
    this.blockSize = 1024;

    if (params && params.maxSize) this.maxSize = filesizeParser(params.maxSize);
    if (params && params.blockSize) this.blockSize = filesizeParser(params.blockSize);

    this.count = parseInt(this.maxSize / this.blockSize, 10)
  }

  log() {
    if (this.silent) return;
    console.log.apply(this, arguments);
  }

  format(speed) {
    return filesize(speed) + '/s';
  }

  dd(inputFile, outputFile) {
    const cmd = `dd if=${inputFile} of=${outputFile} bs=${this.blockSize} count=${this.count}`;
    const child = shell.exec(cmd, { silent: true });

    if (child.code) return null;
    // else return child.stderr; // dd returns stderr no matter what

    const match = (child.stderr || '').match(/([\d.]+)\ss/);
    const result = (match && match.length > 1 && match[1]) || null;
    const speed = parseInt(this.maxSize / parseFloat(result, 10), 10);
    return speed;
  }

  _write() {
    const inputFile = '/dev/zero';
    const outputFile = this.testFilePath;
    return this.dd(inputFile, outputFile);
  }

  _read() {
    const inputFile = this.testFilePath;
    const outputFile = '/dev/null';
    return this.dd(inputFile, outputFile);
  }

  test() {
    const maxSize = filesize(this.maxSize);
    const blockSize = filesize(this.blockSize);
    this.log(`--- Test: ${maxSize} on ${blockSize} blocksize ---`);
    
    const writeSpeed = this._write();
    this.log('Write:', this.format(writeSpeed));

    const readSpeed = this._read();
    this.log('Read:', this.format(readSpeed));

    this.log('\n');
    fs.unlinkSync(this.testFilePath, err => console.log('error: unable to remove test file.'));
    return [writeSpeed, readSpeed];
  }
}

module.exports = Disk;
