const { twitter, sleep } = require('./config') 
const { ApiResponseError } = require('twitter-api-v2')

const main = async () => {
  const user = await twitter.v2.me()
  let nextToken = null
  let deletedCount = 0
  const maxDeletions = 3200 

  do {
    const { data, meta } = await twitter.v2.userTimeline(user.data.id, {
      'tweet.fields': 'created_at',
      max_results: 100,
      pagination_token: nextToken
    })

    for (const tweet of data) {
      try {
        if (deletedCount >= maxDeletions) {
          console.log('Günlük silme limitine ulaşıldı')
          return
        }

        console.log(`Siliniyor: ${tweet.id} (${tweet.created_at})`)
        await twitter.v1.deleteTweet(tweet.id)
        deletedCount++

     
        await sleep(3000) 

      } catch (error) {
        if (error instanceof ApiResponseError) {
          if (error.rateLimitError && error.rateLimit) {
            const waitTime = error.rateLimit.reset * 1000 - Date.now()
            console.log(`Rate limit! ${Math.round(waitTime/1000)} saniye bekleniyor...`)
            await sleep(waitTime)
            continue
          }
          console.error(`API Hatası: ${error.code} - ${error.message}`)
        } else {
          console.error('Beklenmeyen Hata:', error)
        }
      }
    }

    nextToken = meta?.next_token
  } while (nextToken && deletedCount < maxDeletions)

  console.log(`Toplam ${deletedCount} tweet silindi!`)
}

main().catch((e) => console.error('Hata:', e))
