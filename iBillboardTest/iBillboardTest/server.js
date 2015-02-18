
var http = require('http');
var path = require('path');
var fs = require('fs');
var redis = require('./redis.js');
var querystring = require('querystring');
var settings;
var server;

/*
 * Připraví Server
 */
exports.CreateServer = function (setts){
    try {
        settings = setts;
        
        // nastavím port redis DB
        redis.SetPort(settings.redisPort);
        
        // spustím server
        server = http.createServer(serverRequest);
        
        server.listen(settings.port);
    } catch (err) {
        console.log(err);
    }
}

exports.CloseServer = function (){
    if (server != null) {
        server.close();
    }
}

/*
 * Server Request
 */
function serverRequest(req, res) {
    try {
        // oddělím adresu od parametrů
        var spliturl = req.url.split("?");
        
        // pokud jsem na správné adrese
        if (spliturl[0] == settings.path) {
            // parse GET data
            var data = querystring.parse(spliturl[1]);
            
            // vytvořím respons message
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write('JSON Data:' + JSON.stringify(data) + '\r\n');
            
            try {
                // zapíšu data do souboru
                fs.appendFile(settings.outputFile, JSON.stringify(data) + '\r\n', function (err) {
                    if (err != null) {
                        console.log(err);
                    }
                });
            } catch (err) {
                res.write('Data save Error: ' + err);
            }
            
           
            
            // obsahují data položku count?
            if (data.count != null) {
                // Ano: přičtu hodnotu v DB
                redis.IncrementBy(settings.redisValue, data.count, function (incremented) {
                    res.write('Redis Count: ' + incremented);
                    res.end();
                });
            } else {
                // ne: pouze vyčtu poslední hodnotu
                redis.GetValue(settings.redisValue, function (incremented) {
                    res.write('Redis Count: ' + incremented);
                    res.end();
                });
            }
        
        
        } else {
            res.statusCode = 404;
            res.writeHead({ 'Content-Type': 'text/plain' })
            res.end('cannot ' + req.method + ' ' + req.url);
        }
    } catch (err) {
        console.log(err);
    }
}