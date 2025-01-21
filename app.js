const http = require('http');
const fs = require('fs');
const port = 3000;

const server = http.createServer(function (req, res) {
    fs.readFile('home_page.html', function (error, data) {
        if (error) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('Error: File not Found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
        }
        res.end(); // End the response here to avoid sending additional headers
    });
});

server.listen(port, function (error) {
    if (error) {
        console.log('Something Went Wrong', error);
    } else {
        console.log('Server is listening on port ' + port);
    }
});