// require('http')
var http = require('http')
// require('http-proxy')
    , httpProxy = require('http-proxy')
// require('seaport')
    , seaport = require('seaport')
// seaport.connect('localhost', 9090);
    , ports = seaport.connect('localhost', 9090)
    , fs = require('fs');

// Reference til step 4

var i = -1;

var proxy = httpProxy.createProxyServer({});

// Reference til step 4
var helperFlag = 0;
var server = http.createServer(function(req, res) {
    if(helperFlag %2 === 0){
        helperFlag++;
    }
    else{
        helperFlag = 0;
        return;
    }


    var addresses = ports.query('server');
    if (!addresses.length) {
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        res.end('Service unavailable');
        return;
    }

    i = (i + 1) % addresses.length;
    var host = addresses[i].host.split(":").reverse()[0];
    var port = addresses[i].port;
    console.log('port used for the request ' + port);

    proxy.web(req, res, {
    target: 'https://' + host + ':' + port ,
    ssl: {
            key: fs.readFileSync('key/key.pem', 'utf8'),
            cert: fs.readFileSync('key/cert.pem', 'utf8')
          },
    secure: false});
});


server.listen(8000, function () {
    console.log('load balancer listening on port %d', 8000);
});





