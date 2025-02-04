// Create web server
// 1. Load the http module
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

// 2. Create an HTTP server to handle responses
http.createServer(function (req, res) {
    var uri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), uri);

    fs.exists(filename, function(exists) {
        if(!exists) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Not Found\n');
            res.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, 'binary', function(err, file) {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write(err + '\n');
                res.end();
                return;
            }

            res.writeHead(200);
            res.write(file, 'binary');
            res.end();
        });
    });
}).listen(8124);

console.log('Server running at http://