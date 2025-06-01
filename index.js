const Twitter = require("twitter-lite");

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

async function deleteAllTweets() {
  try {
    const tweets = await client.get("statuses/user_timeline", {
      count: 200,
      trim_user: true,
    });

    if (tweets.length === 0) {
      console.log("Silinecek tweet yok.");
      return;
    }

    for (const tweet of tweets) {
      console.log(`Siliniyor: ${tweet.created_at} - ${tweet.text}`);
      await client.post(`statuses/destroy/${tweet.id_str}`, {});
    }

    console.log("İşlem tamamlandı. Birden fazla kez çalıştırarak daha fazla tweet silebilirsin.");

  } catch (error) {
    console.error("Hata:", error);
  }
}

deleteAllTweets();
