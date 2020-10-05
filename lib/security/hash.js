const {PASSWORD_SALT, PASSWORD_STRETCH} = require("../../config/app.config").security;
const crypto = require("crypto");

const digest = function(text){
  let hash;
  text += PASSWORD_SALT;
	
  for(let i = PASSWORD_STRETCH; i--;){
    hash = crypto.createHash("sha256");
    hash.update(text);
    text = hash.digest("hex");
  }
  return text;
};

module.exports = {
  digest
};