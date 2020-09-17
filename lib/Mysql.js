'use strict';

const mysql = require('mysql');

class Mysql {
    constructor( { host, user, password , database } ) {
        this._connection = mysql.createConnection({
            host,
            user,
            password,
            database
        });
    }

    connect( cb ) {
        this._connection.connect(function(err) {
            if (err) throw err;
            cb(this._connection)
        });
    }

    query( sql ) {
        return new Promise((resolve, reject) => {
            this._connection.query(sql, (err, rows) => {
                if( err ) return reject(err);
                resolve(rows);
            });
        })
    }

    async is_database_exists( dbname ) {
        const database_exists = await this.query(`SHOW DATABASES LIKE '%${dbname.toString()}%'`);
        return database_exists.length > 0;
    }
}

module.exports = Mysql;