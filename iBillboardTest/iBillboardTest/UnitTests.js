var assert = require('assert');

// zkouška načtení nastavení
exports['Settings'] = function () {
    try {
        var setts = require('./settings.js');
        var settings = setts.GetSettings();
        if (settings != null) {
            assert.ok(true, "Settings OK");
        } else {
            assert.ok(false, "Settings FAILED");
        }
    } catch (err) {
        assert.ok(false, "Settings FAILED");
    }
}

// zkouška komunikace s redis
exports['Redis'] = function () {
    try {
        var setts = require('./settings.js');
        var settings = setts.GetSettings();
        var redis = require('./redis.js');
        redis.SetPort(settings.redisPort);      
        
        // pokusím se získat hodnotu
        redis.GetValue(settings.redisValue, function (data) {
            if (data == '') {
                count = 0;
            } else {
                count = new Number(data);
            }
            var increment = Math.round(Math.random() * 100);
            
            // pokusím se hodnotu zvýšit o random číslo
            redis.IncrementBy(settings.redisValue, increment, function (data) {
                var num = new Number(data);
                if (num == (count + increment)) {
                    assert.ok(true, "Redis OK");        
                } else {
                    assert.ok(false, "Redis increment FAILED!!");
                }
            });
            
        });
        
    } catch (err) {
        assert.ok(false, "Redis FAILED: "+err);
    }
}

// zkouška zápisu na disk
exports['Write to file'] = function (){
    try {
        var setts = require('./settings.js');
        var settings = setts.GetSettings();
        var fs = require('fs');
        fs.appendFileSync(settings.outputFile, 'test');
        assert.ok(true, "Write to output file OK");
    } catch (err) {
        assert.ok(false, "Can't write to output file: " + err);
    }
}