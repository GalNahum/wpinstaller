'use strict';

// Ref: https://stackoverflow.com/questions/26291647/move-all-files-in-directory-to-parent-with-node-js
const spawn = require('child_process').spawn;
spawn('mv', ['./wordpress/*','./']);