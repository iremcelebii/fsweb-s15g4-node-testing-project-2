const favModel = require("./favs-model");

const begenilmisMi = async (req, res, next) => {
  try {
    const begenilecekTweet = req.params.id;
    let yeniuniqueId = req.decodedJWT.user_id + "_" + begenilecekTweet;
    const varMi = await favModel.XegorefavId({
      combine_fav_id: yeniuniqueId,
    });
    if (varMi == undefined || varMi.combine_fav_id !== yeniuniqueId) {
      next();
    } else {
      res.status(401).json({
        message: `${begenilecekTweet} id'li tweeti zaten beğendiniz`,
      });
    }
  } catch (err) {
    next(err);
  }
};

const begenilmemisMi = async (req, res, next) => {
  try {
    const begenilecekTweet = req.params.id;
    let yeniuniqueId = req.decodedJWT.user_id + "_" + begenilecekTweet;
    const varMi = await favModel.XegorefavId({
      combine_fav_id: yeniuniqueId,
    });
    if (varMi == undefined || varMi.combine_fav_id !== yeniuniqueId) {
      res.status(401).json({
        message: `${begenilecekTweet} id'li tweeti zaten beğenmediniz`,
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const tweetVarMi = async (req, res, next) => {
  try {
    const tweetId = req.params.id;
    const varMi = await favModel.idyeGoreTweetBul(tweetId);
    if (varMi == undefined || varMi.tweet_id !== Number(tweetId)) {
      res.status(401).json({
        message: `${tweetId} id'li bir tweet bulunmuyor`,
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { begenilmisMi, begenilmemisMi, tweetVarMi };
