const knex = require("knex");

//Passing configuration object through knex to connect to sqlite3
const connectedKnex = knex({
    client: "sqlite3",
    connection: {
        filename: "database.sqlite3"
    }
});

//importing my own connected instance of knex to server.js and knex.js
module.exports = connectedKnex;