const router = require("express").Router();
const userModel = require("../users/users-model");
const followModel = require("./follows-model");

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

module.exports = router;
