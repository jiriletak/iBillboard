app.js - hlavní spouštěcí modul 
redis.js - funkce pro komunikaci s Redis databází
server.js - funkce obsluhující HTTP server
settings.js - funkce pro načtení nastavení
settings.json - nastavení aplikace
UnitTest.js - unit testy 

Aplikace čeká na požadavek klienta pomocí HTTP GET požadavek na portu nastaveném v settings.json. 
Pokud adresa obsahuje cestu /track možno změnit v nastavení je string query uložen ve formátu JSON do souboru nastaveném v nastavení aplikace.
Pokud query obsahuje položku count, je tato hodnota přičtena k položce count v redis databázi. Pokud položku neobsahuje, je pouze vyčten aktuální stav count.
Název položky je rovněž možné změnit v nastavení, stejně jako port na kterém běží redis.
odpověď na požadavek obsahuje jak přepis query do formátu JSON tak aktuální stav databáze.