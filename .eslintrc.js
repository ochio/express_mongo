module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "jquery": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "indent":[
      "error",
      2,
      {"SwitchCase": 1}
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-unused-vars":[
      "error",
      {
        "vars": "all",
        "args": "none"
      }
    ],
    "no-console":[
      "off"
    ]
  }
};
