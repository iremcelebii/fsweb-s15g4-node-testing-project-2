const commentModel = require("./comments-model");

const yorumVarMi = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const varMi = await commentModel.XegorecommentId({ comment_id: commentId });
    if (varMi == undefined || varMi.comment_id !== Number(commentId)) {
      res.status(401).json({
        message: `${commentId} id'li bir yorum bulunmuyor`,
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { yorumVarMi };
