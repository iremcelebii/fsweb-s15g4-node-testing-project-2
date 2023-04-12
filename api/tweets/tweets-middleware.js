//!boş tweet atamazsınız

const tweetsModel = require("./tweets-model");

const tweetOkisiyeMiAit = async (req, res, next) => {
  try {
    const tweets = await tweetsModel.XegoreCommentveFavSayilariniBul({
      "users.user_id": req.decodedJWT.user_id,
    });

    for (let i = 0; i < tweets.length; i++) {
      if (tweets[i].tweet_id == req.params.id) {
        return next();
      }
    }
    res
      .status(401)
      .json({ message: `${req.params.id} id'li tweet size ait değil` });
  } catch (err) {
    next(err);
  }
};

const tweetVarMi = async (req, res, next) => {
  try {
    const tweets = await tweetsModel.XegoreCommentveFavSayilariniBul({
      "users.user_id": req.decodedJWT.user_id,
    });

    for (let i = 0; i < tweets.length; i++) {
      if (tweets[i].tweet_id == req.params.id) {
        return next();
      }
    }
    res.status(401).json({
      message: `${req.body.username} isimli kullanıcının ${req.params.id} id'li bir tweeti yok`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { tweetOkisiyeMiAit, tweetVarMi };
