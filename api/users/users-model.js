const db = require("../../data/db-config");

function bul() {
  return db("users").select("user_id", "username");
}

async function idyeGoreBul(user_id) {
  const user = await db("users")
    .leftJoin("roles", "roles.role_id", "users.role_id")
    .select("users.user_id", "users.username", "roles.role_name")
    .where("user_id", user_id)
    .first();

  return user;
}

async function nameeGoreBul(username) {
  const user = await db("users")
    .leftJoin("roles", "roles.role_id", "users.role_id")
    .select("users.user_id", "users.username", "roles.role_name")
    .where("username", username)
    .first();

  return user;
}

async function nameeGoreSıfreBul(username) {
  const user = await db("users")
    .select("username", "password")
    .where("username", username)
    .first();

  return user;
}

async function ekle(user) {
  const [id] = await db("users").insert(user);
  const newUser = await idyeGoreBul(id);
  return newUser;
}

async function ekleOzel({ username, password, role_name }) {
  let created_user_id;
  await db.transaction(async (trx) => {
    let role_id_to_use;
    const [role] = await trx("roles").where("role_name", role_name);
    if (role) {
      role_id_to_use = role.role_id;
    } else {
      const [role_id] = await trx("roles").insert({ role_name: role_name });
      role_id_to_use = role_id;
    }
    const [user_id] = await trx("users").insert({
      username,
      password,
      role_id: role_id_to_use,
    });
    created_user_id = user_id;
  });
  return idyeGoreBul(created_user_id);
}

module.exports = {
  bul,
  idyeGoreBul,
  nameeGoreBul,
  nameeGoreSıfreBul,
  ekle,
  ekleOzel,
};
