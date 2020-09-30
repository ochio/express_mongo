const path = require("path");
const ROOT = path.join(__dirname, "../");

module.exports = {
  appenders: {
    ConsoleLogAppender:{
      type: "console"
    },
    FileLogAppender: {
      type: "file",
      filename: path.join(ROOT, "./log/system/system.log"),
      maxLogSize: 5000000,
      backup: 10
    }
  },
  categories:{
    "default": {
      appenders: ["ConsoleLogAppender"],
      level: "ALL"
    },
    system: {
      appenders: ["FileLogAppender"],
      level: "ERROR"
    }
  }
};