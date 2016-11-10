'use strict';

// require('any-promise/register/bluebird')

const axios = require('axios');
const rp = require('request-promise');
const Promise = require('bluebird');

const verify_token = "mole-is-stupid";
const accessToken = 'EAAIP6NrclHYBAHjJ9dMTKZAQ8wevXvxqAJQkU6BZBRj63r1KwaMQTn2VS3ihkRyJGQgSVThbsCgTsKkFBEwmXkZBSEHgNOFi1JxS9AVzcIJCvqZBPyy8lCZBFyZAjDL8jzPl12Rb55yKOh4H1vM29ZB10m1EZBa57O94dOHLG0r4twZDZD';


//////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////

function botProcess(oneMsg) {
  console.log("Progress: botProcess");

  let text, id;

  try {
    text = oneMsg.message.text;
    id = oneMsg.sender.id;
  } catch(error) {
    return Promise.reject(error);
  }

  if(text.match(/^help$/i)) {
    return Promise.resolve()
      .then( () => textPayload("Try typing: 'gif hello' (without quotes)", id) )
      .then( postReply )
  }

  let matchResult = text.match(/^gif\s+(.+)/i);

  if(!matchResult) {
    return Promise.resolve()
      .then( () => textPayload("I don't know how to respond...", id) )
      .then( postReply )
  }

  return searchGiphy(matchResult[1])
    .then( (url) => imagePayload(url, id) )
    .then( postReply )
    .catch( (error) => {
      return textPayload(error, id).then( postReply )
    })
}

//////////////////////////////////////////////////////////

function processAllMessages(messageEntry) {
  console.log("Progress: processAllMessages");
  return Promise.map( messageEntry.messaging, botProcess)
}

//////////////////////////////////////////////////////////

function postRequest(event, context) {

  return Promise.resolve()
    .then( () => {
      let len = 0;

      try {
        len = event.body.entry.length;
      } catch(error) {
        return Promise.reject(error);
      }

      console.log(`entry length = ${len}`);

      if(len > 0) {
        return Promise.map(event.body.entry, processAllMessages)
          .then( () => context.succeed(`${len} messages processed.`) )
      }
      else {
        return Promise.reject(`${len} messages processed.`);
      }

    })
    .catch( error => context.fail(error) )
}

//////////////////////////////////////////////////////////

function getRequest(event, context) {

  // Facebook app verification

  if (event.query['hub.verify_token'] === verify_token && event.query['hub.challenge']) {
    return context.succeed(parseInt(event.query['hub.challenge']));
  }
  else {
    return context.fail('Invalid token');
  }
}

//////////////////////////////////////////////////////////

module.exports.webhook = (event, context) => {

  if (event.method === 'GET') {
    return getRequest(event, context)
  }
  else if (event.method === 'POST') {
    return postRequest(event, context)
  }
  else {
    let msg = `Unsupported method: ${event.method}`;
    console.log(msg);
    return context.fail(msg);
  }
};
