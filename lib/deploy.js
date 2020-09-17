'use strict';

const fse = require('fs-extra');
const path = require('path');
const { ensure_dir_is_empty, mv } = require('./utils');

module.exports = async ( source = './' ) => {
    const wordpress_dir_scraps = path.join(source, 'wordpress');
    await mv( `${wordpress_dir_scraps}/*`, source );
    await ensure_dir_is_empty( wordpress_dir_scraps );
    await fse.remove(wordpress_dir_scraps);
};