const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

// Debug için anahtar kontrolü
console.log('Consumer Key:', process.env.CONSUMER_KEY ? '***' + process.env.CONSUMER_KEY.slice(-4) : 'MISSING');

const client = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
});
