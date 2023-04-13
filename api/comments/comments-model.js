const db = require("../../data/db-config");

async function idyeGoreTweetBul(tweetid) {
  return await db("tweets").where("tweet_id", tweetid).first();
}

async function XegorecommentId(filter) {
  return await db("comments").select("comments.*").where(filter).first();
}

async function yorumYap(commentObj) {
  const [id] = await db("comments").insert(commentObj);
  const newYorum = await XegorecommentId({ comment_id: id });
  return newYorum;
}
async function yorumSil(comment_id) {
  return db("comments").where("comment_id", comment_id).del();
}

module.exports = {
  XegorecommentId,
  yorumYap,
  yorumSil,
  idyeGoreTweetBul,
};
