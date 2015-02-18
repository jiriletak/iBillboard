/*
 * Jiří Leták
 * modul obsluhující komunikaci s Redis
 */

var net = require('net');
var redisPort = 6379;

/*
 * Připojí se k Redis a odešle příkaz
 */
function SendCommand(cmd, prop, params, result){
    // připojím se k redis a odešlu požadavek
    try {
        var client = net.connect({ port: redisPort }, 
        function () {
            console.log('Connected to Redis server!');  
            client.write(cmd + ' ' + prop + ' ' + params + '\r\n');
        });
    } catch (err) {
        throw err;
    }
    client.setEncoding('utf8');
    
    // čekám na odpověď
    client.on('data', function (data) {
        try {
            result(data);
            console.log(cmd + data.toString());
            client.end();
        } catch (err) {
            console.log(err);
        }
    });
    
    // ukončení
    client.on('end', function () {
        try {
            console.log('Disconnected from Redis');
        } catch (err) {
            console.log(err);
        }
    });

    //error
    client.on('error', function (err){
        console.log(err);
        result(err);
    })
}

/*
 * Zvýší hodnotu count o zadanou hodnotu v Redis DB
 */
exports.IncrementBy = function (prop, value, result) {
    SendCommand('INCRBY', prop, value, function (data) {
        try {
            result(data.toString().replace(':', ''));
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
}

/*
 * Vrátí hodnotu Count z Redis DB
 */
exports.GetValue = function (prop, result) {
    SendCommand('GET', prop, '', function (data) {
        try {
            var splitdata = data.split('\n');
            result(splitdata[1]);
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
}

/*
 * nastavení portu
 */
exports.SetPort = function (port){
    redisPort = port;
}