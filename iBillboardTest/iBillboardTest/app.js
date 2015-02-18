/*
 * Jiří Leták
 * Hlavní modul programu
 */

// připravím potřebné moduly
var server = require('./server.js');
var setts = require('./settings.js');

// načtu nastavení
var settings = setts.GetSettings();

// spustím server
server.CreateServer(settings);
console.log('Server running at http://127.0.0.1:' + settings.port + settings.path);





