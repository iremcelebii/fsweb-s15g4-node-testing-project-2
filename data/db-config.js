const knex = require("knex");
const configs = require("../knexfile.js");
const environment = process.env.NODE_ENV || "development";
const db = knex(configs[environment]);

module.exports = db;
