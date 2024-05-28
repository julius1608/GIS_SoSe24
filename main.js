// Funktion, um Spielerinformationen im LocalStorage zu speichern
function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
}

// Funktion, um Spielerinformationen aus dem LocalStorage zu laden
function loadPlayers() {
    const storedPlayers = localStorage.getItem('players');
    if (storedPlayers) {
        players = JSON.parse(storedPlayers);
    }
}

// Spielerinformationen beim Laden der Seite abrufen
window.onload = () => {
    loadPlayers();
    if (players.length > 0) {
        updatePlayerInfo(players[currentPlayerIndex]);
    }
};

// Funktion, um die Spielerinformationen zu aktualisieren
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

// Funktion, um einen neuen Spieler hinzuzufügen
function addPlayer() {
    let newPlayer = {
        name: "Neuer Spieler",
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
    players.push(newPlayer);
    currentPlayerIndex = players.length - 1;
    updatePlayerInfo(newPlayer);
    savePlayers();
}

// Funktion, um die Informationen eines Spielers zu ändern
function changePlayer() {
    if (players.length === 0) return;
    let player = players[currentPlayerIndex];
    player.name = prompt("Name:", player.name);
    player.age = prompt("Alter:", player.age);
    player.height = prompt("Größe:", player.height);
    player.position = prompt("Position:", player.position);
    player.foot = prompt("Fuß:", player.foot);
    player.nationality = prompt("Nationalmannschaft:", player.nationality);
    player.caps = prompt("Länderspiele:", player.caps);
    player.goals = prompt("Tore:", player.goals);
    player.club = prompt("Aktueller Verein:", player.club);
    player.since = prompt("Im Team seit:", player.since);
    player.value = prompt("Aktueller Marktwert:", player.value);
    player.image = prompt("Bild URL:", player.image);
    updatePlayerInfo(player);
    savePlayers();
}

// Funktion, um einen Spieler zu löschen
function deletePlayer() {
    if (players.length === 0) return;
    players.splice(currentPlayerIndex, 1);
    if (players.length === 0) {
        let placeholderPlayer = {
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
        updatePlayerInfo(placeholderPlayer);
    } else {
        currentPlayerIndex = currentPlayerIndex % players.length;
        updatePlayerInfo(players[currentPlayerIndex]);
    }
    savePlayers();
}

// Funktion, um zum nächsten Spieler zu wechseln
function nextPlayer() {
    if (players.length === 0) return;
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updatePlayerInfo(players[currentPlayerIndex]);
}

// Funktion, um die Bildskalierung zu ändern
function changeImageScale(scale) {
    document.getElementById('player-image').style.transform = `scale(${scale / 100})`;
}
