const rolesModel = require("../roles/roles-model");
const userModel = require("./users-model");
const bcryptjs = require("bcryptjs");
const roleIdVarmi = async (req, res, next) => {
  try {
    const roleId = req.params.id;
    const varMi = await rolesModel.idyegoreroluBul(roleId);
    if (varMi !== undefined && varMi.role_id == roleId) {
      next();
    } else {
      res
        .status(401)
        .json({ message: `${roleId} id'li bir rol bulunmamaktadır` });
    }
  } catch (err) {
    next(err);
  }
};

const userIdVarmi = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const varMi = await userModel.idyeGoreBul(userId);
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
    const varMi = await userModel.nameeGoreBul(username);
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
    const user = await userModel.nameeGoreSıfreBul(req.decodedJWT.username);
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

module.exports = { roleIdVarmi, userIdVarmi, sifreDogruMu, usernameVarmi };
