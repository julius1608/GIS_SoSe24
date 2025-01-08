# Digitales Sammelalbum EM 🃏

Digitales Sammelheft für die EM 2024, in der jeder User seine ganz eigenen Spieler erstellen, bearbeiten und löschen kann in dafür angefertigte Textfelder und Buttons. Auf der rechten Seite sieht man ein Bild des Spielers und Links seine Daten und Eigenschaften wie Marktwert, Verein, Größe, Tore etc.

## Run The App 🚀

### Database
Start and stop the mongodb database.
```sh
brew services start mongodb-community@8.0
brew services stop mongodb-community@8.0
```

Initialize the mongodb database with data from the players.json. The old data gets wiped and the new data is inserted in the mongodb players collection.
```sh
npm run initdb
```

### Server
Start and run the backend and static files server for the frontend.
```sh
npm run start
```