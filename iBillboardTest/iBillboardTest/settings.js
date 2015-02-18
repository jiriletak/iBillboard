exports.GetSettings = function (){
    var fs = require('fs');
    // načtu nastavení
    var settString = fs.readFileSync('settings.json', 'utf8');
    return JSON.parse(settString);
}