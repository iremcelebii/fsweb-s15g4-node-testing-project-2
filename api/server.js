const express = require("express");
const authRouter = require("./auth/auth-router.js");
const usersRouter = require("./users/users-router.js");

const server = express();
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.use((req, res, next) => {
  res.status(404).send("Aradığınız adres bulunamadı");
});

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
