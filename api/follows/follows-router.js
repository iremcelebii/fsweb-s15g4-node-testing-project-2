const router = require("express").Router();
const followModel = require("./follows-model");
const followMd = require("./follows-middleware");
const userMd = require("../users/user-middleware");

router.get("/takipEdilenler/:id", async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const hdhd = await followModel.takipEdilenHesaplar(user_id);
    res.json(hdhd);
  } catch (err) {
    next(err);
  }
});

router.get("/takipciler/:id", async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const hdhd = await followModel.takipEdenHesaplar(user_id);
    res.json(hdhd);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/takipEt/:id",
  userMd.userIdVarmi,
  followMd.kedisiniTakipEdemez,
  followMd.takipEdilmisMi,
  async (req, res, next) => {
    try {
      const takipEdilecekUser = req.params.id;
      let yeniuniqueId = req.decodedJWT.user_id + "_" + takipEdilecekUser;
      const hdhd = await followModel.takipEt({
        combine_user_id: yeniuniqueId,
        to_user_id: takipEdilecekUser,
        from_user_id: req.decodedJWT.user_id,
      });

      res.json(hdhd);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/takibiBirak/:id",
  userMd.userIdVarmi,
  followMd.takipEdilmemisMi,
  async (req, res, next) => {
    try {
      const takiptenCikilacakUser = req.params.id;
      let yeniuniqueId = req.decodedJWT.user_id + "_" + takiptenCikilacakUser;
      const varMi = await followModel.XegoretakipId({
        "follow.combine_user_id": yeniuniqueId,
      });

      await followModel.takibiBırak(yeniuniqueId);

      res.json({
        message: `${varMi.takipedilen} isimli kullanıcı takipten çıkıldı`,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/takipciyiCikar/:id",
  userMd.userIdVarmi,
  followMd.takipciDegilMi,
  async (req, res, next) => {
    try {
      const takipciListesindenCikilacakkUser = req.params.id;
      let yeniuniqueId =
        takipciListesindenCikilacakkUser + "_" + req.decodedJWT.user_id;
      const varMi = await followModel.XegoretakipId({
        "follow.combine_user_id": yeniuniqueId,
      });

      await followModel.takibiBırak(yeniuniqueId);

      res.json({
        message: `${varMi.takipedenID} id'li takipçi çıkarıldı`,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
