'use strict';

module.exports.default = (event, context, callback) => {
  console.log(JSON.stringify(event));
  callback();
};
