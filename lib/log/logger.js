const log4js = require("log4js");
const cnofig = require("../../config/log4js.config");

log4js.configure(cnofig);

const console = log4js.getLogger();

module.exports = {
  console
};