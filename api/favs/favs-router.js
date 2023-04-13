const router = require("express").Router();
const favModel = require("./favs-model");

router.get("/begen/:id", async (req, res, next) => {
  try {
    const begenilecektweetID = req.params.id;
    let yeniuniqueId = req.decodedJWT.user_id + "_" + begenilecektweetID;
    const hdhd = await favModel.begen({
      combine_fav_id: yeniuniqueId,
      tweet_id: begenilecektweetID,
      from_user_id: req.decodedJWT.user_id,
    });

    res.json(hdhd);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/begeniKaldir/:id",

  async (req, res, next) => {
    try {
      let yeniuniqueId = req.decodedJWT.user_id + "_" + req.params.id;
      const varMi = await favModel.XegorefavId({
        combine_fav_id: yeniuniqueId,
      });

      await favModel.begenKaldir(yeniuniqueId);

      res.json({
        message: `${varMi.tweet_id} id'li tweetten beğeni kaldırıldı`,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
