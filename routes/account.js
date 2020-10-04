const router = require("express").Router();

const validateRegistData = function(body){
  let isValidated = true;
  let errors = {};


  if(!body.url){
    isValidated = false;
    errors.url = "URLが未入力です";
  }
  if(body.url && /^\//.test(body.url) === false){
    isValidated = false;
    errors.url = "'/'から始まるURLを入力してください";
  }
  if(!body.title){
    isValidated = false;
    errors.title = "タイトルが未入力です";
  }

  return isValidated ? undefined : errors;
};

const createRegistData = function(body){
  const datetime = new Date();
  return{
    url: body.url,
    published: datetime,
    update: datetime,
    title: body.title,
    content: body.content,
    keywords: (body.keywords || "").split(","),
    authors: (body.authors || "").split(","),
  };
};

router.get("/", (req, res) => {
  res.render("./account/index.ejs");
});

router.get("/posts/regist", (req, res) => {
  res.render("./account/posts/regist-form.ejs");
});

router.post("/posts/regist/input", (req, res) => {
  const original = createRegistData(req.body);
  res.render("./account/posts/regist-form.ejs", {original});
});

router.post("/posts/regist/confirm", (req, res) => {
  const original = createRegistData(req.body);
  const errors = validateRegistData(req.body);
  if(errors){
    res.render("./account/posts/regist-form.ejs", {errors,original});
    return;
  }
  res.render("./account/posts/regist-confirm.ejs", {original});
});

module.exports = router;