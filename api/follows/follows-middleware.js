const followModel = require("./follows-model");

const takipEdilmisMi = async (req, res, next) => {
  try {
    const takipEdilecekUser = req.params.id;
    let yeniuniqueId = req.decodedJWT.user_id + "_" + takipEdilecekUser;
    const varMi = await followModel.XegoretakipId({
      "follow.combine_user_id": yeniuniqueId,
    });
    if (varMi == undefined || varMi.combine_user_id !== yeniuniqueId) {
      next();
    } else {
      res.status(401).json({
        message: `${varMi.takipedilen} isimli kullanıcı zaten takip ediliyor`,
      });
    }
  } catch (err) {
    next(err);
  }
};

const takipEdilmemisMi = async (req, res, next) => {
  try {
    const takipEdilecekUser = req.params.id;
    let yeniuniqueId = req.decodedJWT.user_id + "_" + takipEdilecekUser;
    const varMi = await followModel.XegoretakipId({
      "follow.combine_user_id": yeniuniqueId,
    });
    if (varMi == undefined || varMi.combine_user_id !== yeniuniqueId) {
      res.status(401).json({
        message: `${takipEdilecekUser} id'li kullanıcı zaten takip edilmiyor`,
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const takipciDegilMi = async (req, res, next) => {
  try {
    let yeniuniqueId = req.params.id + "_" + req.decodedJWT.user_id;
    const varMi = await followModel.XegoretakipId({
      "follow.combine_user_id": yeniuniqueId,
    });
    if (varMi == undefined || varMi.combine_user_id !== yeniuniqueId) {
      res.status(401).json({
        message: `${req.params.id} id'li kullanıcı zaten takipçiniz değil`,
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const kedisiniTakipEdemez = async (req, res, next) => {
  try {
    if (req.params.id == req.decodedJWT.user_id) {
      res.status(401).json({
        message: "Kullanıcı kendini takip edemez",
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  takipEdilmisMi,
  takipEdilmemisMi,
  takipciDegilMi,
  kedisiniTakipEdemez,
};
