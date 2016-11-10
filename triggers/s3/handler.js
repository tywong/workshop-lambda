'use strict';

module.exports.s3DetectUpload = (event, context, callback) => {
  console.log(JSON.stringify(event));
  callback();
};
