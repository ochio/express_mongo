const {CONNECTION_URL, DATABASE, OPTIONS} = require("../../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;

// posts, users, privileges
const insertPosts = function(db){
  return Promise.all([
    db.collection("posts").insertMany([{
      url: "/2017/05/hello-nodejs.html",
      published: new Date(2017, 4, 2),
      updated: new Date(2017, 4, 2),
      title: "ようこそ Node.js の世界へ",
      content: "Node.js は おもしろい！",
      keywords: ["Node.js"],
      authors: ["Yuta Sato"]
    }, {
      url: "/2017/06/nodejs-basic.html",
      published: new Date(2017, 5, 12),
      updated: new Date(2017, 5, 12),
      title: "Node.js の 基本",
      content: "ちょっと難しくなってきた！？",
      keywords: ["Node.js"],
      authors: ["Yuta Sato"]
    }, {
      url: "/2017/07/advanced-nodejs.html",
      published: new Date(2017, 7, 8),
      updated: new Date(2017, 7, 8),
      title: "Node.js 応用",
      content: "Node.js で Excel ファイルが触れるなんて！！",
      keywords: ["Node.js"],
      authors: ["Yuta Sato"]
    }]),
    db.collection("posts").createIndex({url:1}, {unique: true, background: true})
  ]);
};

const insertUsers = function(db){
  return Promise.all([
    db.collection("users").insertOne({
      email: "yuta.sato@sample.com",
      name: "Yuta Sato",
      password: "qwerty", //"qwerty", // "ac912478bc1bcf5fe29d37960954d2b5958e200045eaf21092d02415c9fb8ca6"
      role: "owner"
    }),
    db.collection("users")
      .createIndex({ email: 1 }, { unique: true, background: true })
  ]);
};

const insertPrivileges = function(db){
  return Promise.all([
    db.collection("privileges").insertMany([
      { role: "default", permissions: ["read"] },
      { role: "owner", permissions: ["readWrite"] }
    ]),
    db.collection("privileges")
      .createIndex({ role: 1 }, { unique: true, background: true })
  ]);
};
MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
  const db = client.db(DATABASE);
  Promise.all([
    insertPosts(db),
    insertUsers(db),
    insertPrivileges(db)
  ]).catch((error) => {
    console.log();
  }).then(() => {
    client.close();
  });
});