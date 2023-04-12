//!Veritabanına erişim fonskiyonları:
/*
GET:
  idyeGoreUserBul,
  XeGoreUserBul,
  userlarınGizliBilgileriniBul,
  XegoreuserlarınGizliBilgileriniBul,
  takipciVeTakipEdilenHesapla,
  idyegoretakipciVeTakipEdilenHesapla,
POST:
  ekle,
  ekleOzel,
UPDATE:
  updateSifre,
  updateUsername,
DELETE:
  kullaniciSil,
 */

const db = require("../../data/db-config");
const bcryptjs = require("bcryptjs");

async function idyeGoreUserBul(user_id) {
  const user = await db("users")
    .leftJoin("roles", "roles.role_id", "users.role_id")
    .select("users.user_id", "users.username", "roles.role_name")
    .where("user_id", user_id)
    .first();
  return user;
}
async function XeGoreUserBul(filter) {
  const user = await db("users")
    .leftJoin("roles", "roles.role_id", "users.role_id")
    .select("users.user_id", "users.username", "roles.role_name")
    .where(filter)
    .first();
  return user;
}

function userlarınGizliBilgileriniBul() {
  return db("users")
    .leftJoin("roles", "roles.role_id", "users.role_id")
    .leftJoin("sorular", "sorular.soru_id", "users.soru_id")
    .select(
      "users.username",
      "users.password",
      "roles.role_id",
      "roles.role_name",
      "sorular.soru_name",
      "users.soru_cevap"
    );
}
function XegoreuserlarınGizliBilgileriniBul(filter) {
  return db("users")
    .leftJoin("roles", "roles.role_id", "users.role_id")
    .leftJoin("sorular", "sorular.soru_id", "users.soru_id")
    .select(
      "users.username",
      "users.password",
      "roles.role_id",
      "roles.role_name",
      "sorular.soru_name",
      "users.soru_cevap"
    )
    .where(filter);
}

function takipEdilenHesapla() {
  return db("users")
    .select("users.user_id", "users.username")
    .leftJoin("follow", "users.user_id", "follow.to_user_id")
    .count("follow.from_user_id as takipciSayisi")
    .groupBy("users.user_id");
}

function takipciHesapla(username) {
  return db("users")
    .select("users.username")
    .leftJoin("follow", "users.user_id", "follow.from_user_id")
    .count("follow.to_user_id as takipEdilenSayisi")
    .groupBy("users.user_id")
    .where("users.username", username)
    .first();
}
function tweetHesapla(username) {
  return db("users")
    .leftJoin("tweets", "users.user_id", "tweets.user_id")
    .select("users.user_id", "users.username")
    .count("tweets.tweet_id as tweetSayisi")
    .groupBy("users.user_id")
    .where("users.username", username)
    .first();
}

async function takipciVeTakipEdilenHesapla() {
  let array = await takipEdilenHesapla();
  for (let i = 0; i < array.length; i++) {
    let obje = await takipciHesapla(array[i].username);
    let obje2 = await tweetHesapla(array[i].username);
    array[i] = {
      ...array[i],
      takipEdilenSayisi: obje.takipEdilenSayisi,
      tweetSayisi: obje2.tweetSayisi,
    };
  }
  return array;
}

async function idyegoretakipciVeTakipEdilenHesapla(userId) {
  let array = await takipciVeTakipEdilenHesapla();
  for (let i = 0; i < array.length; i++) {
    if (array[i].user_id == userId) {
      return array[i];
    }
  }
}

async function ekle(user) {
  const [id] = await db("users").insert(user);
  const newUser = await idyeGoreUserBul(id);
  return newUser;
}

async function ekleOzel({
  username,
  password,
  role_name,
  soru_id,
  soru_cevap,
}) {
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
      soru_id,
      soru_cevap,
    });
    created_user_id = user_id;
  });
  return idyeGoreUserBul(created_user_id);
}

async function updateSifre(username, password) {
  const hashedPassword = bcryptjs.hashSync(password, 12);
  return await db("users")
    .where("username", username)
    .update("password", hashedPassword);
}

async function updateUsername(id, username) {
  return await db("users").where("user_id", id).update("username", username);
}

async function kullaniciSil(id) {
  return db("users").where("user_id", Number(id)).del();
}

module.exports = {
  userlarınGizliBilgileriniBul,
  idyeGoreUserBul,
  ekle,
  ekleOzel,
  updateSifre,
  XegoreuserlarınGizliBilgileriniBul,
  takipciVeTakipEdilenHesapla,
  idyegoretakipciVeTakipEdilenHesapla,
  updateUsername,
  kullaniciSil,
  XeGoreUserBul,
};
