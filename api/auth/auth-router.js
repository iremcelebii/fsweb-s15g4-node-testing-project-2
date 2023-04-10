const router = require("express").Router();
const bcryptjs = require("bcryptjs");

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
  authMd.rolAdiGecerlimi,
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

module.exports = router;
