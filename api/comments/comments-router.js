const router = require("express").Router();
const commentModel = require("./comments-model");
const favMd = require("../favs/favs-middleware");
const commentMd = require("./comments-middleware");
const TweetModel = require("../tweets/tweets-model");
router.get("/yorumYap/:id", favMd.tweetVarMi, async (req, res, next) => {
  try {
    const yorumYapilacaktweetID = req.params.id;
    const hdhd = await commentModel.yorumYap({
      tweet_id: yorumYapilacaktweetID,
      from_user_id: req.decodedJWT.user_id,
      comment_content: req.body.comment_content,
    });
    const tweet = await TweetModel.XegoreCommentveFavSayilariniBul({
      "tweets.tweet_id": yorumYapilacaktweetID,
    });
    res.json({ commentObjesi: hdhd, tweetObjesi: tweet[0] });
  } catch (err) {
    next(err);
  }
});

router.get("/yorumSil/:id", commentMd.yorumVarMi, async (req, res, next) => {
  try {
    const commentObj = await commentModel.XegorecommentId({
      comment_id: req.params.id,
    });
    await commentModel.yorumSil(req.params.id);
    const tweet = await TweetModel.XegoreCommentveFavSayilariniBul({
      "tweets.tweet_id": commentObj.tweet_id,
    });
    res.json({
      message: `${req.params.id} id'li  yorum kaldırıldı`,
      "Kaldırılan yorum": commentObj.comment_content,
      "Yorumun kaldırıldığı tweet": tweet[0],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
