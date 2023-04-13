//!End pointler:
/*
  /secret,          :  Tüm kullanıcıların gizli bilgilerini listeler (password, role, güvenlik sorusu ve cevabı)  
  /secret/role/:id, :  Rolü user olan tüm kullanıcıların gizli bilgilerini listeler (password, role, güvenlik sorusu ve cevabı)  
  /,                :  Tüm kullanıcıların gizli olmayan bilgilerini listeler (username, takipciSayisi, takipEdilenSayisi ve tweetSayisi) 
  /:id,             :  X id'li kullanıcının gizli olmayan bilgilerini listeler (username, takipciSayisi, takipEdilenSayisi ve tweetSayisi) 
  /usernameChange   :
  /passwordChange   :
  /removeUser       :
*/

const router = require("express").Router();
const userModel = require("./users-model");
const authMd = require("../auth/auth-middleware");
const userMd = require("./user-middleware");

router.get("/secret", authMd.sadece("admin"), async (req, res, next) => {
  try {
    const users = await userModel.userlarınGizliBilgileriniBul();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/secret/role/:id",
  userMd.roleIdVarmi,
  authMd.sadece("admin"),
  async (req, res, next) => {
    try {
      const roleId = req.params.id;
      const users = await userModel.XegoreuserlarınGizliBilgileriniBul({
        "roles.role_id": roleId,
      });
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/", authMd.sadece("admin"), async (req, res, next) => {
  try {
    let response = await userModel.takipciVeTakipEdilenHesapla();
    res.json(response);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", userMd.userIdVarmi, async (req, res, next) => {
  try {
    const userId = req.params.id;
    let response = await userModel.idyegoretakipciVeTakipEdilenHesapla(userId);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/usernameChange",
  authMd.usernameBostami,
  async (req, res, next) => {
    try {
      const username = req.body.username;
      await userModel.updateUsername(req.decodedJWT.user_id, username);
      res.json({
        message: `Kullanıcı adınız başarı ile değiştirilmiştir, yeni kullanıcı adınız: ${req.body.username}`,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/passwordChange",
  authMd.sifreYeterliMi,
  async (req, res, next) => {
    try {
      const password = req.body.password;
      await userModel.updateSifre(req.decodedJWT.username, password);
      res.json({
        message: `Şifreniz başarı ile değiştirilmiştir, yeni şifreniz: ${req.body.password}`,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/removeUser",
  userMd.userIdVarmi2,
  userMd.sifreDogruMu,

  async (req, res, next) => {
    try {
      await userModel.kullaniciSil(req.decodedJWT.user_id);
      res.json({
        message: "Hesap başarı ile silinmiştir",
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
