const {CONNECTION_URL, OPTIONS, DATABASE} = require("../config/mongodb.config");
const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;

router.get("/*", (req, res) => {
  const keyword = req.query.keyword || "";
  const regexp = new RegExp(`.*${keyword}.*`);
  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    const db = client.db(DATABASE);
    db.collection("posts").find({
      $or: [{title: regexp}, {content: regexp}]
    }).sort({
      published: -1
    }).toArray()
      .then((list) => {
        const data = {
          keyword,
          list
        };
        res.render("./search/list.ejs",data);
      }).catch((error) => {
        throw error;
      }).then(() => {
        client.close();
      });
  });
});

module.exports = router;