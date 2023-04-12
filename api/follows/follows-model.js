const db = require("../../data/db-config");

async function takipEdilenHesaplar(user_id) {
  const temeltablo = await db("users")
    .select(
      "users.username as takipedilen",
      "follow.to_user_id as takipedilenID"
    )
    .leftJoin("follow", "users.user_id", "follow.to_user_id")
    .where("follow.from_user_id", user_id);

  let obje = {
    takipedenID: user_id,
    takipedilenSayisi: temeltablo.length,
    takipedilenler: temeltablo,
  };

  return obje;
}

async function takipEdenHesaplar(user_id) {
  const temeltablo = await db("users")
    .select("users.username as takipeden", "follow.from_user_id as takipedenID")
    .leftJoin("follow", "users.user_id", "follow.from_user_id")
    .where("follow.to_user_id", user_id);

  let obje = {
    takipedilenID: user_id,
    takipciSayisi: temeltablo.length,
    takipciler: temeltablo,
  };

  return obje;
}

async function XegoretakipId(filter) {
  return await db("users")
    .select(
      "follow.follow_id",
      "follow.combine_user_id",
      "follow.from_user_id as takipedenID",
      "follow.to_user_id as takipedilenID",
      "users.username as takipedilen"
    )
    .leftJoin("follow", "users.user_id", "follow.to_user_id")
    .where(filter)
    .first();
}

async function takipEt(followObj) {
  const [id] = await db("follow").insert(followObj);
  const newFollow = await XegoretakipId({ "follow.follow_id": id });
  return newFollow;
}
async function takibiBırak(combine_user_id) {
  return db("follow").where("combine_user_id", Number(combine_user_id)).del();
}

module.exports = {
  takipEdilenHesaplar,
  takipEdenHesaplar,
  XegoretakipId,
  takipEt,
  takibiBırak,
};
