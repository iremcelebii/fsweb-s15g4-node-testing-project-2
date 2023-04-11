const db = require("../../data/db-config");

function rolleriBul() {
  return db("roles");
}

function idyegoreroluBul(roleId) {
  return db("roles").where("role_id", roleId).first();
}

module.exports = { rolleriBul, idyegoreroluBul };
