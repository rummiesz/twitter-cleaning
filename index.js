const { TwitterApi } = require('twitter-api-v2');
const dotenv = require('dotenv');

dotenv.config();

// Twitter client oluşturma
const client = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
});

// Tweet silme fonksiyonu
const deleteAllTweets = async () => {
  try {
    const user = await client.v2.me();
    let nextToken;
    let deletedCount = 0;

    do {
      const { data, meta } = await client.v2.userTimeline(user.data.id, {
        max_results: 100,
        pagination_token: nextToken,
        'tweet.fields': 'created_at'
      });

      for (const tweet of data) {
        try {
          await client.v1.deleteTweet(tweet.id);
          console.log(`Silindi: ${tweet.id}`);
          deletedCount++;
          
          // Rate limit koruması (3 saniye bekle)
          await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (err) {
          console.error(`Hata (${tweet.id}):`, err.message);
        }
      }

      nextToken = meta?.next_token;
    } while (nextToken);

    console.log(`Toplam ${deletedCount} tweet silindi!`);
  } catch (err) {
    console.error('Ana hata:', err);
  }
};

deleteAllTweets();
