const router = require("express").Router();
const favModel = require("./favs-model");
const favMd = require("./favs-middleware");
const TweetModel = require("../tweets/tweets-model");
router.get(
  "/begen/:id",
  favMd.tweetVarMi,
  favMd.begenilmisMi,
  async (req, res, next) => {
    try {
      const begenilecektweetID = req.params.id;
      let yeniuniqueId = req.decodedJWT.user_id + "_" + begenilecektweetID;
      const hdhd = await favModel.begen({
        combine_fav_id: yeniuniqueId,
        tweet_id: begenilecektweetID,
        from_user_id: req.decodedJWT.user_id,
      });
      const tweet = await TweetModel.XegoreCommentveFavSayilariniBul({
        "tweets.tweet_id": begenilecektweetID,
      });
      res.json({ favObjesi: hdhd, tweetObjesi: tweet[0] });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/begeniKaldir/:id",
  favMd.tweetVarMi,
  favMd.begenilmemisMi,
  async (req, res, next) => {
    try {
      let yeniuniqueId = req.decodedJWT.user_id + "_" + req.params.id;

      await favModel.begenKaldir(yeniuniqueId);
      const tweet = await TweetModel.XegoreCommentveFavSayilariniBul({
        "tweets.tweet_id": req.params.id,
      });
      res.json({
        message: `${req.params.id} id'li tweetten beğeni kaldırıldı`,
        tweetObjesi: tweet[0],
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
