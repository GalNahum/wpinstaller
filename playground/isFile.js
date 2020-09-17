'use strict';

const fs = require('fs');
console.log( fs.lstatSync(path.resolve('file.txt')).isFile() );