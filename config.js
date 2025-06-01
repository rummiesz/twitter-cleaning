const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

// DEBUG: Anahtarları kontrol edelim
console.log('Consumer Key:', process.env.CONSUMER_KEY?.slice(0, 4) + '...');

const client = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
});

// Client'ı test edelim
client.v2.me().then(user => {
  console.log('API Bağlantısı Başarılı! User ID:', user.data.id);
}).catch(err => {
  console.error('API Bağlantı Hatası:', err);
});

module.exports = { twitter: client };
