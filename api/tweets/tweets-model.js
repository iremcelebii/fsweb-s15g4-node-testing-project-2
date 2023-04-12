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

function commentSayisiniBul() {
  return db("tweets")
    .leftJoin("users", "users.user_id", "tweets.user_id")
    .leftJoin("comments", "comments.tweet_id", "tweets.tweet_id")
    .select("users.username", "tweets.tweet_content", "tweets.tweet_id")
    .count("comments.comment_id as ToplamYorumSayisi")
    .groupBy("tweets.tweet_id");
}
function favSayisiniBul() {
  return db("tweets")
    .leftJoin("users", "users.user_id", "tweets.user_id")
    .leftJoin("favs", "favs.tweet_id", "tweets.tweet_id")
    .select("users.username", "tweets.tweet_content", "tweets.tweet_id")
    .count("favs.fav_id as ToplamFavSayisi")
    .groupBy("tweets.tweet_id");
}
async function commentveFavSayilariniBul() {
  const commentler = await commentSayisiniBul();
  const favlar = await favSayisiniBul();

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

//!-------------------------------------------------------------
function XegoreFavSayisiniBul(filtreObje) {
  return db("tweets")
    .leftJoin("users", "users.user_id", "tweets.user_id")
    .leftJoin("favs", "favs.tweet_id", "tweets.tweet_id")
    .select("users.username", "tweets.tweet_content", "tweets.tweet_id")
    .count("favs.fav_id as ToplamFavSayisi")
    .groupBy("tweets.tweet_id")
    .where(filtreObje);
}
function XegoreCommentSayisiniBul(filtreObje) {
  return db("tweets")
    .leftJoin("users", "users.user_id", "tweets.user_id")
    .leftJoin("comments", "comments.tweet_id", "tweets.tweet_id")
    .select("users.username", "tweets.tweet_content", "tweets.tweet_id")
    .count("comments.comment_id as ToplamYorumSayisi")
    .groupBy("tweets.tweet_id")
    .where(filtreObje);
}
async function XegoreCommentveFavSayilariniBul(filtreObje) {
  const favlar = await XegoreFavSayisiniBul(filtreObje);
  const commentler = await XegoreCommentSayisiniBul(filtreObje);

  let temeltablo = [];
  for (let i = 0; i < favlar.length; i++) {
    for (let j = 0; j < commentler.length; j++) {
      if (favlar[i].tweet_id == commentler[j].tweet_id) {
        let obje = {
          tweet_id: favlar[i].tweet_id,
          ...favlar[i],
          ToplamYorumSayisi: commentler[j].ToplamYorumSayisi,
        };
        temeltablo.push(obje);
      }
    }
  }
  return temeltablo;
}

async function ismegoreCommentveFavSayilariniBul(username) {
  const temeltablo = await XegoreCommentveFavSayilariniBul({
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
        tweet_id: obj.tweet_id,
        tweet_content: obj.tweet_content,
        ToplamFavSayisi: obj.ToplamFavSayisi,
        ToplamYorumSayisi: obj.ToplamYorumSayisi,
      });
    });
    return response;
  }
}

function XegorecommentleriBul(filtreObje) {
  return db("tweets")
    .leftJoin("users", "users.user_id", "tweets.user_id")
    .leftJoin("comments", "comments.tweet_id", "tweets.tweet_id")
    .select(
      "users.username",
      "tweets.tweet_content",
      "tweets.tweet_id",
      "comments.comment_id",
      "comments.comment_content",
      "comments.from_user_id as Yorumuyazan"
    )
    .where(filtreObje);
}

function XegorefavlariBul(filtreObje) {
  return db("tweets")
    .leftJoin("users", "users.user_id", "tweets.user_id")
    .leftJoin("favs", "favs.tweet_id", "tweets.tweet_id")
    .select(
      "users.username",
      "tweets.tweet_content",
      "tweets.tweet_id",
      "favs.fav_id",
      "favs.from_user_id as Begenen"
    )
    .where(filtreObje);
}

async function ismegoreCommentveFavlariBul(username) {
  const temeltablo = await ismegoreCommentveFavSayilariniBul(username);
  const ikincitablo = await XegorecommentleriBul({
    "users.username": username,
  });
  const ucuncutablo = await XegorefavlariBul({
    "users.username": username,
  });

  let bosArray1 = [];
  let response = "";
  for (let i = 0; i < temeltablo.tweetler.length; i++) {
    for (let j = 0; j < ikincitablo.length; j++) {
      if (
        temeltablo.tweetler[i].ToplamYorumSayisi == 0 &&
        temeltablo.tweetler[i].ToplamFavSayisi == 0
      ) {
        response = temeltablo;
      } else if (
        temeltablo.tweetler[i].ToplamYorumSayisi !== 0 &&
        temeltablo.tweetler[i].tweet_id == ikincitablo[j].tweet_id
      ) {
        let obje = {
          comment_content: ikincitablo[j].comment_content,
          Yorumuyazan: ikincitablo[j].Yorumuyazan,
        };

        bosArray1.push(obje);
      }
    }
    temeltablo.tweetler[i] = {
      ...temeltablo.tweetler[i],
      yorumlar: bosArray1,
    };
    response = temeltablo;
    bosArray1 = [];
  }

  for (let i = 0; i < temeltablo.tweetler.length; i++) {
    for (let j = 0; j < ucuncutablo.length; j++) {
      if (
        temeltablo.tweetler[i].ToplamYorumSayisi == 0 &&
        temeltablo.tweetler[i].ToplamFavSayisi == 0
      ) {
        response = temeltablo;
      } else if (
        temeltablo.tweetler[i].ToplamFavSayisi !== 0 &&
        temeltablo.tweetler[i].tweet_id == ucuncutablo[j].tweet_id
      ) {
        let obje = {
          fav_id: ucuncutablo[j].fav_id,
          Begenen: ucuncutablo[j].Begenen,
        };
        bosArray1.push(obje);
      }
    }
    temeltablo.tweetler[i] = {
      ...temeltablo.tweetler[i],
      begenenler: bosArray1,
    };
    response = temeltablo;
    bosArray1 = [];
  }

  return response;
}
async function ismegoreXidliTweetinCommentveFavlariBul(username, id) {
  const temeltablo = await ismegoreCommentveFavlariBul(username);

  for (let i = 0; i < temeltablo.tweetler.length; i++) {
    if (temeltablo.tweetler[i].tweet_id == id) {
      return temeltablo.tweetler[i];
    }
  }
}

async function tweetEkle(tweet) {
  const [id] = await db("tweets").insert(tweet);
  const newTweet = await XegoreCommentveFavSayilariniBul({
    "tweets.tweet_id": id,
  });

  return newTweet;
}
async function tweetSil(id) {
  return db("tweets").where("tweet_id", Number(id)).del();
}

module.exports = {
  ismegoreCommentveFavSayilariniBul,
  XegoreCommentveFavSayilariniBul,
  commentveFavSayilariniBul,
  tweetEkle,
  tweetSil,
  ismegoreCommentveFavlariBul,
  ismegoreXidliTweetinCommentveFavlariBul,
};
