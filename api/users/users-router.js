const router = require("express").Router();

router.get("/", (req, res, next) => {
  try {
    res.json({ message: "selam router" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
