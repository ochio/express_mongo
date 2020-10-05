const router = require("express").Router();

router.get("/", (req,res) => {
  throw new Error("Hello");
  // res.render("./index.ejs");
});

module.exports = router;