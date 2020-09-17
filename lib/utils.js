'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const Axios = require('axios');
const extract = require('extract-zip');
const {spawn} = require('child_process');

function ensure_file_exists(file) {
    return new Promise((resolve, reject) => {
        fs.exists(file, async (exists) => {
            if (!exists) {
                return await ensure_file_exists(file);
            }
            resolve(file);
        });
    });
}

async function download_file(file_url, file_path) {
    const response = await Axios({
        url: file_url,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(fs.createWriteStream(file_path));

    return new Promise((resolve, reject) => {
        response.data.on('end', async () => {
            await ensure_file_exists(file_path);
            resolve(file_path);
        });
        response.data.on('error', err => reject(err));
    });
}

function ensure_dir_is_empty(dirname) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirname, async function (err, files) {
            if (err) {
                // some sort of error
                reject(err)
            } else {
                if (!files.length) {
                    // directory appears to be empty
                    return resolve(true);
                }
                return await ensure_dir_is_empty(dirname);
            }
        });
    });
}

async function extract_zip(zip_path, dir) {
    await extract(zip_path, {dir});
    await fse.remove(zip_path);
}

function mv(src, dist = './') {
    return new Promise((resolve, reject) => {
        const _mv = spawn('mv', [src, dist]);
        _mv.stdout.on('data', data => console.log(`stdout: ${data}`));
        _mv.stderr.on('data', (data) => reject(data));
        _mv.on('close', (code) => resolve(code));
    });
}

module.exports = {
    ensure_file_exists,
    download_file,
    ensure_dir_is_empty,
    extract_zip,
    mv
};