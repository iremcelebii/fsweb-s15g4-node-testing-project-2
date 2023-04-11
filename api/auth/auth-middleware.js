const { JWT_SECRET } = require("../secrets"); // bu secreti kullanın!
const userModel = require("../users/users-model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

//!register için

async function gerekliBilgilerVarMi(req, res, next) {
  try {
    const user = req.body;
    if (!user.username) {
      res.status(422).json({ message: "Lütfen bir kullanıcı adı giriniz" });
    } else if (!user.password) {
      res.status(422).json({ message: "Lütfen bir şifre giriniz" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}
//!register için
async function usernameBostami(req, res, next) {
  try {
    const user = await userModel.nameeGoreBul(req.body.username);
    if (!user) {
      next();
    } else {
      res.status(422).json({ message: "Username kullaniliyor" });
    }
  } catch (err) {
    next(err);
  }
}

async function sifreYeterliMi(req, res, next) {
  try {
    const userSifre = req.body.password;
    if (userSifre.length < 8) {
      res.status(422).json({ message: "Şifre en az 8 karakterden oluşmalı" });
    } else if (
      userSifre.match(
        "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8" || "9" || "0"
      ) == null
    ) {
      res.status(422).json({ message: "Şifre en az 1 rakam içermeli" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

//!register/ozel için
const rolAdiKontrolu = async (req, res, next) => {
  try {
    if (req.body.role_name) {
      const trimliRoleName = req.body.role_name.trim().toLowerCase();
      if (trimliRoleName.length > 32) {
        res
          .status(422)
          .json({ message: "rol adı 32 karakterden fazla olamaz" });
      } else if (trimliRoleName) {
        req.body.role_name = trimliRoleName;
        next();
      }
    } else {
      res.status(422).json({ message: "Lütfen rol adı girin" });
    }
  } catch (err) {
    next(err);
  }
};

//!login için
const usernameVarmi = async (req, res, next) => {
  try {
    const { username } = req.body;
    const varMi = await userModel.nameeGoreBul(username);
    // console.log(varMi);
    // console.log(username);
    if (varMi !== undefined && varMi.username == username) {
      next();
    } else {
      res.status(401).json({ message: "Kullanıcı adı veya şifre yanlış" });
    }
  } catch (err) {
    next(err);
  }
};
//!login için
async function sifreDogruMu(req, res, next) {
  try {
    const user = await userModel.nameeGoreSıfreBul(req.body.username);
    // console.log(dbdekiSifre); SADECE ŞİFRE GELMİYORMUŞ BURADAN
    if (bcryptjs.compareSync(req.body.password, user.password)) {
      next();
    } else {
      res.status(401).json({ message: "Kullanıcı adı veya şifre yanlış" }); //yanlış şifre
    }
  } catch (err) {
    next(err);
  }
}
//!Giriş yapıldıktan sonra gidilebilecek end pointler için
const tokenKontrolu = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decodedJWT) => {
        if (err) {
          res.status(401).json({ message: "Token gecersizdir" });
        } else {
          req.decodedJWT = decodedJWT;
          console.log(req.decodedJWT);
          next();
        }
      });
    } else {
      res.status(401).json({ message: "Token gereklidir" });
    }
  } catch (err) {
    next(err);
  }
};

//!login olduktan sonraki end pointler için- rolü kontrol ediyoruz:
const sadece = (role_name) => (req, res, next) => {
  try {
    if (req.decodedJWT && req.decodedJWT.role_name == role_name) {
      next();
    } else {
      res.status(403).json({ message: "Bu, senin için değil" });
    }
  } catch (err) {
    next(err);
  }
};

//!şifreunuttum end pointi için gerekli:
async function soruVeCevapDogruMu(req, res, next) {
  try {
    const user = await userModel.nameeGoreSoruBul(req.body.username);
    // console.log(dbdekiSifre); SADECE ŞİFRE GELMİYORMUŞ BURADAN
    if (
      user.soru_name !== req.body.soru_name ||
      user.soru_cevap !== req.body.soru_cevap
    ) {
      res.status(401).json({ message: "Seçtiğiniz soru veya cevap yanlış" }); //yanlış şifre
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}
async function sifreFarkliMi(req, res, next) {
  try {
    const user = await userModel.nameeGoreSıfreBul(req.body.username);
    // console.log(dbdekiSifre); SADECE ŞİFRE GELMİYORMUŞ BURADAN
    if (bcryptjs.compareSync(req.body.password, user.password)) {
      res
        .status(401)
        .json({ message: "Daha önce kullanmadığınız bir şifre giriniz" }); //yanlış şifre
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  gerekliBilgilerVarMi,
  sifreYeterliMi,
  usernameBostami,
  rolAdiKontrolu,
  usernameVarmi,
  sifreDogruMu,
  tokenKontrolu,
  sadece,
  soruVeCevapDogruMu,
  sifreFarkliMi,
};
