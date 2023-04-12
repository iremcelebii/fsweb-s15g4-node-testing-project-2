const router = require("express").Router();
const tweetsModel = require("./tweets-model");
const twwetMd = require("./tweets-middleware");
const userMd = require("../users/user-middleware");
router.get("/", async (req, res, next) => {
  try {
    const tweets = await tweetsModel.commentveFavSayilariniBul();
    res.json(tweets);
  } catch (err) {
    next(err);
  }
});

router.post("/tweetlerdetay", userMd.usernameVarmi, async (req, res, next) => {
  try {
    const username = req.body.username;
    const tweets = await tweetsModel.ismegoreCommentveFavlariBul(username);
    res.json(tweets);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/tweetdetay/:id",
  userMd.usernameVarmi,
  twwetMd.tweetVarMi,
  async (req, res, next) => {
    try {
      const username = req.body.username;
      const tweetid = req.params.id;
      const tweets = await tweetsModel.ismegoreXidliTweetinCommentveFavlariBul(
        username,
        tweetid
      );
      res.json(tweets);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/:id", userMd.userIdVarmi, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const tweets = await tweetsModel.XegoreCommentveFavSayilariniBul({
      "users.user_id": userId,
    });
    res.json(tweets);
  } catch (err) {
    next(err);
  }
});

router.post("/aramaCubugu", userMd.usernameVarmi, async (req, res, next) => {
  try {
    const username = req.body.username;
    const tweets = await tweetsModel.ismegoreCommentveFavSayilariniBul(
      username
    );
    res.json(tweets);
  } catch (err) {
    next(err);
  }
});

router.post("/yaz", async (req, res, next) => {
  try {
    const tweet_content = req.body.tweet_content;
    const user_id = req.decodedJWT.user_id;
    const newTweet = await tweetsModel.tweetEkle({ user_id, tweet_content });
    res.status(201).json(newTweet);
  } catch (err) {
    next(err);
  }
});

router.post("/sil/:id", twwetMd.tweetOkisiyeMiAit, async (req, res, next) => {
  try {
    await tweetsModel.tweetSil(req.params.id);
    res
      .status(201)
      .json({ message: `${req.params.id} id'li tweet başarı ile silindi` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
