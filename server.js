const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'players.json');

// Middleware zum Parsen von JSON
app.use(express.json());

// Statische Dateien aus Ordner ausliefern
app.use(express.static(path.join(__dirname, 'frontend')));

let players = [];

// Spieler aus Datei laden
function loadPlayers() {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        players = JSON.parse(data);
    }
}

// Spieler in Datei speichern
function savePlayers() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2));
}

// Route für die Root-URL ("/") hinzufügen
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html')); //dirname damit der spielername gefunden wird
});

// Alle Spieler abrufen
app.get('/players', (req, res) => {
    res.json(players);
});

// Neuen Spieler hinzufügen
app.post('/players', (req, res) => {
    const newPlayer = req.body;
    newPlayer._id = Date.now().toString(); // Eindeutige ID basierend auf Zeitstempel zuweisen
    players.push(newPlayer);
    savePlayers();
    console.log('Daten hinzugefügt');
    res.status(201).json(newPlayer);
});

// Bestehenden Spieler aktualisieren
app.put('/players/:id', (req, res) => {
    const playerId = req.params.id;
    const updatedPlayer = req.body;

    const playerIndex = players.findIndex(p => p._id === playerId);
    if (playerIndex === -1) {
        return res.status(404).json({ error: 'Spieler nicht gefunden' });
    }

    players[playerIndex] = { ...players[playerIndex], ...updatedPlayer };
    savePlayers();
    res.json(players[playerIndex]);
});

// Spieler löschen
app.delete('/players/:id', (req, res) => {
    const playerId = req.params.id;
    players = players.filter(p => p._id !== playerId);
    savePlayers();
    res.status(204).end();
});

// Spieler laden, wenn der Server startet
loadPlayers();

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`); //mein code checkt erstmal ab ob schon spieler vorhanden sind
});
