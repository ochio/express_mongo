const {CONNECTION_URL, OPTIONS, DATABASE} = require("../config/mongodb.config");
const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const tokens = new require("csrf")();

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
  tokens.secret((error, secret) => {
    const token = tokens.create(secret);
    req.session._csrf = secret;
    res.cookie("_csrf", token);
    res.render("./account/posts/regist-form.ejs");
  });
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

router.post("/posts/regist/execute", (req, res) => {

  const secret = req.session._csrf;
  const token = req.cookies._csrf;
	
  if(tokens.verify(secret, token) === false){
    throw new Error("Invalid Token");
  }

  const original = createRegistData(req.body);
  const errors = validateRegistData(req.body);
  if(errors){
    res.render("./account/posts/regist-form.ejs", {errors,original});
    return;
  }
	
  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    const db = client.db(DATABASE);
    db.collection("posts").insertOne((original))
      .then(() => {
        delete req.session._csrf;
        res.clearCookie("_csrf");
        res.redirect("/account/posts/regist/complete");
      }).catch((error) => {
        throw error;
      }).then(() => {
        client.close();
      });
  });
});

router.get("/posts/regist/complete", (req, res) => {
  res.render("./account/posts/regist-complete.ejs");
});

module.exports = router;