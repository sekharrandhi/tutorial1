const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializationDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
  }
};
initializationDBAndServer();

//get players

app.get("/players/", async (request, response) => {
  const getPlayers = `
    SELECT * FROM cricket_team WHERE orderBy playerId;
    `;
  const players = await db.all(getPlayers);
  response.send(players);
});
module.exports = app;

//add new player

app.post("/players/", async (request, response) => {
  const newPlayer = request.body;
  const { playerName, jerseyNumber, role } = newPlayer;
  const addPlayerName = `
  INSERT INTO player(playerName, jerseyNumber, role) VALUES (${"Vishal"},${17},${"bowler"})`;
  const dbResponse = await db.run(addPlayerName);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});
module.exports = app;

//players/:playerId/

app.get("/players/:playerId", async (request, response) => {
  const getPlayers = `
    SELECT * FROM cricket_team WHERE orderBy playerId;
    `;
  const players = await db.all(getPlayers);
  response.send(players);
});
module.exports = app;

//players/:playerId/
app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    UPDATE player SET playerName = ${"Maneesh"}, jersyNumber = ${54}, role = ${"All-rounder"} WHERE player_Id = {playerIs}; `;
  await db.run(updatePlayerQuery);
  response.send("Player Added to Team");
});
module.exports = app;

//delete

app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM player WHERE player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
