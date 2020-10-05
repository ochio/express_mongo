const {SESSION_SECRET} = require("./config/app.config").security;
const accesslogger = require("./lib/log/accesslogger");
const systemlogger = require("./lib/log/systemlogger");
const accountcontrol = require("./lib/security/accoutcontrol");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const { route } = require("./routes");
const app = express();

app.set("view engine", "ejs");
app.disable("x-powered-by");

app.use("/public", express.static(__dirname + "/public/" + (process.env.NODE_ENV === "development" ? "development" : "production")));

// 静的ファイルではアクセスログを残さず、アプリケーションに関わるところのログを残すから
// この場所でaccesslogerを読み込む
app.use(accesslogger());

app.use(cookieParser());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: "sid"
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(flash());
app.use(...accountcontrol.initialize());

app.use("/api", (() => {
  const router = express.Router();
  router.use("/posts", require("./api/posts.js"));
  return router;
})());

app.use("/", (() => {
  const router = express.Router();
  router.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    next();
  });
  router.use("/posts/", require("./routes/posts.js"));
  router.use("/search", require("./routes/search.js"));
  router.use("/account", require("./routes/account.js"));
  router.use("/", require("./routes/index"));
  return router;
})());

app.use(systemlogger());

app.use((req, res, next) => {
  const data = {
    method: req.method,
    protocol: req.protocol,
    version: req.httpVersion,
    url: req.url
  };
  res.status(404);
  if(req.xhr){
    res.json(data);
  }else{
    res.render("./404.ejs", {data});
  }
});

app.use((err, req, res, next) => {
  const data = {
    method: req.method,
    protocol: req.protocol,
    version: req.httpVersion,
    url: req.url,
    error: (process.env.NODE_ENV === "development") ? {
      name: err.name,
      message: err.message,
      stack: err.stack
    }: undefined,
  };
  res.status(500);
  if(req.xhr){
    res.json(data);
  }else{
    res.render("./500.ejs", {data});
  }
});

app.listen(3000);
