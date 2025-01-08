/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

const mongoose = require('mongoose');
const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');

const Player = require('./models');

/* -------------------------------------------------------------------------- */
/*                                    Init                                    */
/* -------------------------------------------------------------------------- */

const PORT = 3000;
const MONGO_URL = 'mongodb://localhost:27017/sammelalbum';

/* -------------------------------------------------------------------------- */
/*                                 Middlewares                                */
/* -------------------------------------------------------------------------- */

/**
 * Helper to parse JSON bodies from requests.
 */
function parseJSONBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => (data += chunk));
        req.on('end', () => {
        try {
            // If no body was sent, we return an empty object.
            resolve(data ? JSON.parse(data) : {});
        } catch (error) {
            reject(error);
        }
        });
        req.on('error', (err) => reject(err));
    });
}

/**
 * Serve static files from ../frontend.
 */
function serveStaticFile(filepath, res) {
    fs.readFile(filepath, (err, data) => {
        if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'Not found' }));
        }
        // A proper production app might guess mime types; 
        // here we just return the file data.
        res.statusCode = 200;
        return res.end(data);
    });
}

/* -------------------------------------------------------------------------- */
/*                                  Endpoints                                 */
/* -------------------------------------------------------------------------- */

async function requestHandler(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;

    // Handle static files (GET requests to anything in ../frontend)
    if (method === 'GET' && parsedUrl.pathname.startsWith('/')) {
        const filePath = path.join(__dirname, '../frontend', parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return serveStaticFile(filePath, res);
        }
    }

    // --------------------------------------------------------------------------
    // /players
    // --------------------------------------------------------------------------
    if (parsedUrl.pathname === '/players') {
        if (method === 'GET') {
        try {
            const players = await Player.find();
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(players));
        } catch (error) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: 'Database error' }));
        }
        }
        if (method === 'POST') {
        try {
            const body = await parseJSONBody(req);
            const newPlayer = new Player(body);
            await newPlayer.save();
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(newPlayer));
        } catch (error) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: 'Database error' }));
        }
        }
    }

    // --------------------------------------------------------------------------
    // /players/:id
    // --------------------------------------------------------------------------
    if (parsedUrl.pathname.startsWith('/players/')) {
        const id = parsedUrl.pathname.split('/')[2];
        if (method === 'PUT') {
        try {
            const body = await parseJSONBody(req);
            const updatedPlayer = await Player.findByIdAndUpdate(id, body, { new: true });
            if (!updatedPlayer) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Spieler nicht gefunden' }));
            }
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(updatedPlayer));
        } catch (error) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: 'Database error' }));
        }
        }
        if (method === 'DELETE') {
        try {
            const deletedPlayer = await Player.findByIdAndDelete(id);
            if (!deletedPlayer) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Spieler nicht gefunden' }));
            }
            res.statusCode = 204; // No Content
            return res.end();
        } catch (error) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: 'Database error' }));
        }
        }
    }

    // Fallback if route not matched
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
}

/* -------------------------------------------------------------------------- */
/*                                Start Server                                */
/* -------------------------------------------------------------------------- */

async function startServer() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Connected to MongoDB');

        const server = http.createServer(requestHandler);
        server.listen(PORT, () => {
        console.log(`Server läuft auf http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
