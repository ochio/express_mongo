const accesslogger = require("./lib/log/accesslogger");
const systemlogger = require("./lib/log/systemlogger");
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.disable("x-powered-by");

app.use("/public", express.static(__dirname + "/public/" + (process.env.NODE_ENV === "development" ? "development" : "production")));

// 静的ファイルではアクセスログを残さず、アプリケーションに関わるところのログを残すから
// この場所でaccesslogerを読み込む
app.use(accesslogger());

app.use("/", require("./routes/index"));
app.use("/posts/", require("./routes/posts.js"));
app.use("/search", require("./routes/search.js"));
app.use("/account", require("./routes/account.js"));

app.use(systemlogger());

app.listen(3000);