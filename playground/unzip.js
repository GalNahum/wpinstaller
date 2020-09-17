'use strict';

const fs       = require('fs');
const unzipper = require('unzipper');

const unzip = async ( zip_path = './latest.zip' ) => {
    return new Promise((resolve, reject) => {
        let inp = fs.createReadStream(zip_path);
        let extract = unzipper.Extract({ path: './temp' });
        inp.pipe(extract)
            .on('error', () => reject('error') )
            .on('close', () => resolve('close') );
    });
};

module.exports = unzip;

