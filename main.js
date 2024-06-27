let players = [];
let currentPlayerIndex = 0;

// Spielerinformationen aus dem Server laden
async function loadPlayers() {
    try {
        const response = await fetch('http://localhost:3000/players');
        players = await response.json();
        if (players.length > 0) {
            updatePlayerInfo(players[currentPlayerIndex]);
        }
    } catch (error) {
        console.error('Fehler beim Laden der Spieler:', error);
    }
}

// Spielerinformationen aktualisieren
function updatePlayerInfo(player) {
    document.getElementById('player-name').innerText = player.name;
    document.getElementById('player-age').innerText = player.age;
    document.getElementById('player-height').innerText = player.height;
    document.getElementById('player-position').innerText = player.position;
    document.getElementById('player-foot').innerText = player.foot;
    document.getElementById('player-nationality').innerText = player.nationality;
    document.getElementById('player-caps').innerText = player.caps;
    document.getElementById('player-goals').innerText = player.goals;
    document.getElementById('player-club').innerText = player.club;
    document.getElementById('player-since').innerText = player.since;
    document.getElementById('player-value').innerText = player.value;
    document.getElementById('player-image').src = player.image;
}

// Neuen Spieler hinzufügen
async function addPlayer() {
    let newPlayer = {
        name: "Kein Spieler",
            age: 0,
            height: "0,00 m",
            position: "Unbekannt",
            foot: "Unbekannt",
            nationality: "Unbekannt",
            caps: 0,
            goals: 0,
            club: "Unbekannt",
            since: "Unbekannt",
            value: "0,00 Mio. €",
            image: "https://via.placeholder.com/150"
    };

    try {
        const response = await fetch('http://localhost:3000/players', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPlayer)
        });
        const savedPlayer = await response.json();
        players.push(savedPlayer);
        currentPlayerIndex = players.length - 1;
        updatePlayerInfo(savedPlayer);
    } catch (error) {
        console.error('Fehler beim Hinzufügen des Spielers:', error);
    }
}

// Spielerinformationen ändern
async function changePlayer() {
    if (players.length === 0) return;

    let player = players[currentPlayerIndex];
    player.name = prompt("Name:", player.name) || player.name;
    player.age = prompt("Alter:", player.age) || player.age;
    player.height = prompt("Größe:", player.height) || player.height;
    player.position = prompt("Position:", player.position) || player.position;
    player.foot = prompt("Fuß:", player.foot) || player.foot;
    player.nationality = prompt("Nationalmannschaft:", player.nationality) || player.nationality;
    player.caps = prompt("Länderspiele:", player.caps) || player.caps;
    player.goals = prompt("Tore:", player.goals) || player.goals;
    player.club = prompt("Aktueller Verein:", player.club) || player.club;
    player.since = prompt("Im Team seit:", player.since) || player.since;
    player.value = prompt("Aktueller Marktwert:", player.value) || player.value;
    player.image = prompt("Bild URL:", player.image) || player.image;

    try {
        const response = await fetch(`http://localhost:3000/players/${player._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(player)
        });
        const updatedPlayer = await response.json();
        players[currentPlayerIndex] = updatedPlayer;
        updatePlayerInfo(updatedPlayer);
    } catch (error) {
        console.error('Fehler beim Ändern des Spielers:', error);
    }
}

// Spieler löschen
async function deletePlayer() {
    if (players.length === 0) return;

    try {
        const playerId = players[currentPlayerIndex]._id;
        const response = await fetch(`http://localhost:3000/players/${playerId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            players.splice(currentPlayerIndex, 1);
            if (players.length === 0) {
                updatePlayerInfo({
                    name: "Kein Spieler",
                    age: 0,
                    height: "0,00 m",
                    position: "Unbekannt",
                    foot: "Unbekannt",
                    nationality: "Unbekannt",
                    caps: 0,
                    goals: 0,
                    club: "Unbekannt",
                    since: "Unbekannt",
                    value: "0,00 Mio. €",
                    image: "https://via.placeholder.com/150"
                });
            } else {
                currentPlayerIndex = currentPlayerIndex % players.length;
                updatePlayerInfo(players[currentPlayerIndex]);
            }
        } else {
            console.error('Fehler beim Löschen des Spielers:', await response.text());
        }
    } catch (error) {
        console.error('Fehler beim Löschen des Spielers:', error);
    }
}

// Zum nächsten Spieler wechseln
function nextPlayer() {
    if (players.length === 0) return;
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updatePlayerInfo(players[currentPlayerIndex]);
}

// Bildskalierung ändern
function changeImageScale(scale) {
    document.getElementById('player-image').style.transform = `scale(${scale / 100})`;
}

// Seite laden und Spielerinformationen abrufen
window.onload = function () {
    loadPlayers();
};
