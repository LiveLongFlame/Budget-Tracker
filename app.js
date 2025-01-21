const http = require('http');
const fs = require('fs');
const path = require('path'); // to handle file extensions
const port = 3000;

const server = http.createServer(function (req, res) {
    let filePath = req.url === '/' ? 'home_page.html' : req.url.slice(1);
    let extname = path.extname(filePath);

    // Default to 'html' if no extension is provided (for '/'
    if (!extname) filePath += '.html';

    // Set default content type
    let contentType = 'text/html';

    if (extname === '.js') {
        contentType = 'application/javascript';
    } else if (extname === '.css') {
        contentType = 'text/css';
    } else if (extname === '.json') {
        contentType = 'application/json';
    }

    // Read and serve the file
    fs.readFile(filePath, function (error, data) {
        if (error) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('Error: File not Found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
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
