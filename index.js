const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const pathname = reqUrl.pathname;
    const query = reqUrl.query;

    switch (req.method) {
        case 'GET':
            if (pathname === '/') {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Welcome to File Management Tool\n');
            } else if (pathname === '/read' && query.file) {
                readFile(query.file, res);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found\n');
            }
            break;
        case 'POST':
            if (pathname === '/create' && query.file && query.content) {
                createFile(query.file, query.content, res);
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Bad Request\n');
            }
            break;
        case 'DELETE':
            if (pathname === '/delete' && query.file) {
                deleteFile(query.file, res);
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Bad Request\n');
            }
            break;
        default:
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed\n');
            break;
    }
});

function readFile(filename, res) {
    const filepath = path.join(__dirname, filename);
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found\n');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        }
    });
}

function createFile(filename, content, res) {
    const filepath = path.join(__dirname, filename);
    fs.writeFile(filepath, content, (err) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error creating file\n');
        } else {
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end('File created successfully\n');
        }
    });
}

function deleteFile(filename, res) {
    const filepath = path.join(__dirname, filename);
    fs.unlink(filepath, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found or error deleting file\n');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('File deleted successfully\n');
        }
    });
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
