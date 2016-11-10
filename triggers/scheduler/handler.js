'use strict';

module.exports.cron = (event, context, callback) => {
  console.log(JSON.stringify(event));
  context.succeed(`success: ${new Date()}`);
};
