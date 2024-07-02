const mysqld = require('mysql2');

 const Connection = mysqld.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'file_upload'
});

Connection.connect((err)=>{
    if(err) {
    console.log('connected');}
    else{
        console.log('not connected');
    }
});


 module.exports = Connection;