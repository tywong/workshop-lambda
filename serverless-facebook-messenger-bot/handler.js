'use strict';

// require('any-promise/register/bluebird')

const axios = require('axios');
const rp = require('request-promise');
const Promise = require('bluebird');

const accessToken = 'EAAIP6NrclHYBAHjJ9dMTKZAQ8wevXvxqAJQkU6BZBRj63r1KwaMQTn2VS3ihkRyJGQgSVThbsCgTsKkFBEwmXkZBSEHgNOFi1JxS9AVzcIJCvqZBPyy8lCZBFyZAjDL8jzPl12Rb55yKOh4H1vM29ZB10m1EZBa57O94dOHLG0r4twZDZD';

function searchGiphy(keyword) {
  console.log("Progress: searchGiphy");

  let apiKey = "dc6zaTOxFJmzC";
  let limit = 10;
  let query = encodeURIComponent(keyword);
  let url = `http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${apiKey}&limit=${limit}`;

  return rp( {
    "url": url,
    "json": true
  })
  .then( (json) => {
    if(json.data && json.data.length > 0) {
      let i = parseInt(Math.random() * json.data.length);
      return Promise.resolve(json.data[i].images.fixed_height.url);
    }
    else {
      return Promise.reject("Cannot find any images");
    }
  })
}

function imagePayload(url, id) {
  console.log("Progress: imagePayload");
  return {
    recipient: { "id": id },
    "message":{
        "attachment":{
          "type":"image",
          "payload":{ "url": url }
        }
      }
    }
}

function postReply(payload) {
  console.log("Progress: postReply");
  const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`;
  return axios.post(url, payload)
}

function textPayload(payload, id) {
  console.log("Progress: textPayload");
  return {
    recipient: { "id": id },
    "message":{ "text": payload }
  }
}


function botProcess(messagingItem) {
  console.log("Progress: botProcess");
  if (messagingItem.message && messagingItem.message.text) {
    return searchGiphy(messagingItem.message.text)
      .then( (url) => imagePayload(url, messagingItem.sender.id) )
      .then( postReply )
      .catch( (error) => {
        return textPayload(error, messagingItem.sender.id).then( postReply )
      })
  }
  else {
    return null;
  }
}

function processMessages(messageEntry) {
  console.log("Progress: processMessages");
  return Promise.map( messageEntry.messaging, botProcess)
}

module.exports.webhook = (event, context, callback) => {

  if (event.method === 'GET') {
    // Facebook app verification
    if (event.query['hub.verify_token'] === 'mole-is-stupid' && event.query['hub.challenge']) {
      callback(null, parseInt(event.query['hub.challenge']));
    }
    callback('Invalid token');
  }

  if (event.method === 'POST') {
    if(event && event.body && event.body.entry && event.body.entry.length > 0) {
      console.log(`entry length = ${event.body.entry.length}`);
      return Promise.map(event.body.entry, processMessages)
        .then( () => context.succeed(null) )
    }
    else {
      console.log("wrong event input");
      context.fail(null);
    }
  }
};
