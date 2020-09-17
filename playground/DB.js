'use strict';
const mysql = require('mysql');

class Mysql {

    constructor( config ) {
        this.conn = mysql.createConnection( config );
    }

    async connect() {
        return new Promise(async (resolve, reject) => {
            this.conn.connect(err => {
                if (err) return reject(err);
                resolve(this.conn);
            });
        });
    }

    query( query ) {
        return new Promise(async (resolve, reject) => {

            const cb = (err, result) => {
                if (err) return reject(err);
                resolve(result);
            };

            this.conn.connect(err => {
                if (err) reject(err);
                this.conn.query( query, cb );
            });
        });
    }

    create_database( dbname ) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.query( `CREATE DATABASE IF NOT EXISTS ${dbname.toString()} COLLATE utf8_general_ci` );
                resolve( ( 'serverStatus' in result && parseInt( result.serverStatus ) === 1 ) );
            }catch (e) {
                reject(e);
            }
        });
    }

    static parse_args( args, defaults = {} ) {
        const filter = () => {
            const result = {};
            for (let key in args) {
                if (args.hasOwnProperty(key) && args[key])
                    result[key] = args[key];
            }
            return result;
        };
        return {...defaults, ...filter(args) }
    }
}

class DB {

    static instance = null;

    static config = {
        user: null,
        password: null,
        host: null,
    };

    /**
     * @returns {Mysql}
     */
    static getInstance()  {
        if ( DB.instance == null )
            DB.instance = new Mysql( DB.config );

        return DB.instance;
    }

}

module.exports = DB;
