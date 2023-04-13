//!Kontroller:
/*
  roleIdVarmi, 
  userIdVarmi, 
  sifreDogruMu, 
  usernameVarmi
*/

const userModel = require("./users-model");
const bcryptjs = require("bcryptjs");

const roleIdVarmi = async (req, res, next) => {
  try {
    const user = await userModel.XegoreuserlarınGizliBilgileriniBul({
      "users.role_id": req.params.id,
    });

    if (user[0] !== undefined && user[0].role_id == req.params.id) {
      next();
    } else {
      res
        .status(401)
        .json({ message: `${req.params.id} id'li bir rol bulunmamaktadır` });
    }
  } catch (err) {
    next(err);
  }
};

const userIdVarmi = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const varMi = await userModel.idyeGoreUserBul(userId);
    if (varMi !== undefined && varMi.user_id == userId) {
      next();
    } else {
      res
        .status(401)
        .json({ message: `${userId} id'li bir kullanıcı bulunmamaktadır` });
    }
  } catch (err) {
    next(err);
  }
};

const userIdVarmi2 = async (req, res, next) => {
  try {
    const userId = req.decodedJWT.user_id;
    const varMi = await userModel.idyeGoreUserBul(userId);
    if (varMi !== undefined && varMi.user_id == userId) {
      next();
    } else {
      res
        .status(401)
        .json({ message: `${userId} id'li bir kullanıcı bulunmamaktadır` });
    }
  } catch (err) {
    next(err);
  }
};

const usernameVarmi = async (req, res, next) => {
  try {
    const username = req.body.username;
    const varMi = await userModel.XeGoreUserBul({
      "users.username": req.body.username,
    });
    if (varMi !== undefined && varMi.username == username) {
      next();
    } else {
      res
        .status(401)
        .json({ message: `${username} isminde bir kullanıcı bulunmamaktadır` });
    }
  } catch (err) {
    next(err);
  }
};

async function sifreDogruMu(req, res, next) {
  try {
    const user = await userModel.XegoreuserlarınGizliBilgileriniBul({
      "users.username": req.decodedJWT.username,
    });

    if (bcryptjs.compareSync(req.body.password, user[0].password)) {
      next();
    } else {
      res.status(401).json({ message: "Kullanıcı adı veya şifre yanlış" }); //yanlış şifre
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  roleIdVarmi,
  userIdVarmi,
  sifreDogruMu,
  usernameVarmi,
  userIdVarmi2,
};
