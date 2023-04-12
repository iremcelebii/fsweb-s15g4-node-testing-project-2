const db = require("../../data/db-config");

function commentleriBul() {
  return db("tweets")
    .leftJoin("users", "users.user_id", "tweets.user_id")
    .leftJoin("comments", "comments.tweet_id", "tweets.tweet_id")
    .select("users.username", "tweets.tweet_content", "tweets.tweet_id")
    .count("comments.comment_id as ToplamYorumSayisi")
    .groupBy("tweets.tweet_id");
}

function favlariBul() {
  return db("tweets")
    .leftJoin("users", "users.user_id", "tweets.user_id")
    .leftJoin("favs", "favs.tweet_id", "tweets.tweet_id")
    .select("users.username", "tweets.tweet_content", "tweets.tweet_id")
    .count("favs.fav_id as ToplamFavSayisi")
    .groupBy("tweets.tweet_id");
}

async function commentveFavlariBul() {
  const commentler = await commentleriBul();
  const favlar = await favlariBul();

  let temeltablo = [];
  for (let i = 0; i < favlar.length; i++) {
    for (let j = 0; j < commentler.length; j++) {
      if (favlar[i].tweet_id == commentler[j].tweet_id) {
        let obje = {
          ...favlar[i],
          ToplamYorumSayisi: commentler[j].ToplamYorumSayisi,
        };
        temeltablo.push(obje);
      }
    }
  }
  return temeltablo;
}

function XegoreCommentleriBul(filtreObje) {
  return db("tweets")
    .leftJoin("users", "users.user_id", "tweets.user_id")
    .leftJoin("comments", "comments.tweet_id", "tweets.tweet_id")
    .select("users.username", "tweets.tweet_content", "tweets.tweet_id")
    .count("comments.comment_id as ToplamYorumSayisi")
    .groupBy("tweets.tweet_id")
    .where(filtreObje);
}

function XegoreFavlariBul(filtreObje) {
  return db("tweets")
    .leftJoin("users", "users.user_id", "tweets.user_id")
    .leftJoin("favs", "favs.tweet_id", "tweets.tweet_id")
    .select("users.username", "tweets.tweet_content", "tweets.tweet_id")
    .count("favs.fav_id as ToplamFavSayisi")
    .groupBy("tweets.tweet_id")
    .where(filtreObje);
}

async function XegoreCommentveFavlariBul(filtreObje) {
  const favlar = await XegoreFavlariBul(filtreObje);
  const commentler = await XegoreCommentleriBul(filtreObje);

  let temeltablo = [];
  for (let i = 0; i < favlar.length; i++) {
    for (let j = 0; j < commentler.length; j++) {
      if (favlar[i].tweet_id == commentler[j].tweet_id) {
        let obje = {
          ...favlar[i],
          ToplamYorumSayisi: commentler[j].ToplamYorumSayisi,
        };
        temeltablo.push(obje);
      }
    }
  }
  return temeltablo;
}

async function ismegoreCommentveFavlariBul(username) {
  const temeltablo = await XegoreCommentveFavlariBul({
    "users.username": username,
  });
  //!olmayan bir id girdiğinde:
  if (temeltablo.length === 0) {
    return null;
  }
  const response = {
    username: username,
    tweetler: [],
  };
  if (!temeltablo[0].tweet_content) {
    return response;
  } else {
    temeltablo.forEach((obj) => {
      response.tweetler.push({
        tweet_content: obj.tweet_content,
        ToplamFavSayisi: obj.ToplamFavSayisi,
        ToplamYorumSayisi: obj.ToplamYorumSayisi,
      });
    });
    return response;
  }
}

async function tweetEkle(tweet) {
  const [id] = await db("tweets").insert(tweet);
  const newTweet = await XegoreCommentveFavlariBul({
    "users.user_id": tweet.user_id,
  });
  return newTweet;
}
async function tweetSil(id) {
  return db("tweets").where("tweet_id", Number(id)).del();
}

module.exports = {
  ismegoreCommentveFavlariBul,
  XegoreCommentveFavlariBul,
  commentveFavlariBul,
  tweetEkle,
  tweetSil,
};
