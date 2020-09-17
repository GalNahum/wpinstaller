#!/usr/bin/env node
'use strict';

require('../index')()
    .then( status => {
        console.log( status.message );
        process.exit(0);
    })
    .catch( error => {
        console.error( error );
        process.exit(1);
    });
