'use strict';

const inquirer = require('inquirer');
const Mysql = require('./lib/Mysql');
const installer = require('./lib/installer');
const prompt = require('./lib/prompt');

const confirm_database_exist = async ( dbname ) => {
    const { confirm } = await inquirer.prompt( prompt.database_exist( dbname ) );
    return confirm;
};

const main = ( { answers, root_path } ) => {
    return new Promise( async (resolve, reject) => {

        const { dbname, dbhost: host, uname: user, pwd: password } = answers;

        const db = new Mysql({
            host,
            user,
            password
        });

        if( await db.is_database_exists(dbname) &&
            await confirm_database_exist(dbname) === false ) {
            return reject(`Database ${dbname} already exist`);
        }

        db.query(`CREATE DATABASE IF NOT EXISTS ${dbname} COLLATE utf8_general_ci`)
            .then( rows => {
                parseInt( rows['affectedRows'] ) && console.info(`New database named ${dbname} was created successfully`);

                installer( answers, { root_path } )
                    .then( status => resolve(status) )
                    .catch( err => reject(err) );
            })
            .catch( err => reject(err) );
    });
};

module.exports = async ( root_path = null ) => {
    const answers = await inquirer.prompt( prompt.questions() );
    return await main( { answers, root_path } );
};


