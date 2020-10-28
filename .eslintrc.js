module.exports =  {
  "env": {
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "airbnb-base"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "rules": {
    "no-console": 1,
    "consistent-return": 0,
    "func-names": 0,
    "global-require": 0,
    "no-restricted-globals": 0,
    "no-underscore-dangle": 0,
    "prefer-arrow-callback": 0,
  }
};