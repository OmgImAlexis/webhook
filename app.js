var http = require('http');
var createHandler = require('github-webhook-handler');
var config = require('cz');
var path = require('path');
config.load(path.normalize(__dirname + '/config.json'));
var handler = createHandler({
    path: '/',
    secret: config.get('secret')
});
var git = require('simple-git')(path.normalize(config.get('workingDirectory')));

http.createServer(function (req, res) {
    handler(req, res, function (err) {
        res.statusCode = 404;
        res.end('no such location');
    });
}).listen(7777, function(){
    console.log('Started webhook reciever on port 7777');
});

handler.on('error', function (err) {
    console.error('Error:', err.message);
});

handler.on('push', function (event) {
    console.log('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref);
    git.pull(function(err, update) {
        if(err){ console.log(err); }
    });
});
