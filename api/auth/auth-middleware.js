// const { JWT_SECRET } = require("../secrets"); // bu secreti kullanın!
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
const rolAdiGecerlimi = async (req, res, next) => {
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

module.exports = {
  gerekliBilgilerVarMi,
  sifreYeterliMi,
  rolAdiGecerlimi,
  usernameBostami,
};
