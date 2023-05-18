const mysql = require('mysql');

const connection = mysql.createPool({
    host: 'db4free.net',
    port: 3306,
    user: 'bancopdm',
    password: 'bancopdm1234',
    database: 'bd_pdm',
    connectionLimit: 100,
    multipleStatements: true,
})

exports.connection = connection;