const Twitter = require('twitter-lite');

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const DAYS_LIMIT = 14;
const cutoffDate = new Date(Date.now() - DAYS_LIMIT * 24 * 60 * 60 * 1000);

async function deleteOldTweets() {
  try {
    const tweets = await client.get("statuses/user_timeline", {
      count: 200,
      trim_user: true,
    });

    for (let tweet of tweets) {
      const tweetDate = new Date(tweet.created_at);
      if (tweetDate < cutoffDate) {
        console.log(`Deleting tweet from ${tweetDate}: ${tweet.text}`);
        await client.post(`statuses/destroy/${tweet.id_str}`, {});
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

deleteOldTweets();
