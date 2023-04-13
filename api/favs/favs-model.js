const db = require("../../data/db-config");

async function XegorefavId(filter) {
  return await db("favs").select("favs.*").where(filter).first();
}

async function idyeGoreTweetBul(tweetid) {
  return await db("tweets").where("tweet_id", tweetid).first();
}

async function begen(favObj) {
  const [id] = await db("favs").insert(favObj);
  const newBegeni = await XegorefavId({ "favs.fav_id": id });
  return newBegeni;
}
async function begenKaldir(combine_fav_id) {
  return db("favs").where("combine_fav_id", combine_fav_id).del();
}

module.exports = {
  XegorefavId,
  begen,
  begenKaldir,
  idyeGoreTweetBul,
};
