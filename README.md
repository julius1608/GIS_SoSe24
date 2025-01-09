# Digital scrapbook European Championship 🃏

Digital scrapbook for Euro 2024, in which every user can create, edit and delete their very own players in text fields and buttons created for this purpose. On the right side you can see a picture of the player and on the left his data and characteristics such as market value, club, height, goals etc.

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
