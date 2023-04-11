const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets"); // bu secret'ı kullanın!

const userModel = require("../users/users-model");
const authMd = require("./auth-middleware");

router.post(
  "/register",
  authMd.gerekliBilgilerVarMi,
  authMd.sifreYeterliMi,
  authMd.usernameBostami,
  async (req, res, next) => {
    try {
      const hashedPassword = bcryptjs.hashSync(req.body.password, 12);
      const newUser = await userModel.ekle({
        username: req.body.username,
        role_id: 2,
        password: hashedPassword,
      });
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/register/ozel",
  authMd.gerekliBilgilerVarMi,
  authMd.sifreYeterliMi,
  authMd.usernameBostami,
  authMd.rolAdiKontrolu,
  async (req, res, next) => {
    try {
      const hashedPassword = bcryptjs.hashSync(req.body.password, 12);
      const newUsername = req.body.username + "_" + req.body.role_name;
      const newUser = await userModel.ekleOzel({
        username: newUsername,
        role_name: req.body.role_name,
        password: hashedPassword,
      });
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  authMd.usernameVarmi,
  authMd.sifreDogruMu,
  async (req, res, next) => {
    try {
      const user = await userModel.nameeGoreBul(req.body.username);
      //!TOKEN I TANIMLAYALIM
      const payload = {
        user_id: user.user_id,
        username: user.username,
        role_name: user.role_name,
      };
      const secret = JWT_SECRET;
      const options = { expiresIn: "1d" };
      let token = jwt.sign(payload, secret, options);
      res.token = token;
      console.log(res.token);
      res
        .status(200)
        .json({ message: `Hoşgeldin ${req.body.username}`, token });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/logout", authMd.tokenKontrolu, (req, res, next) => {
  try {
    res.json({
      message: `Hoşçakal ${req.decodedJWT.username}`,
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/sifremiUnuttum",
  authMd.usernameVarmi,
  authMd.soruVeCevapDogruMu,
  authMd.sifreFarkliMi,
  authMd.sifreYeterliMi,

  async (req, res, next) => {
    try {
      await userModel.updateSifre(req.body.username, req.body.password);
      res.json({
        message: "Şifreniz başarı ile değiştirilmiştir",
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
