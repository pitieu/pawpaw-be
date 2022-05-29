import dotenv from 'dotenv'

import { populateServiceCategory } from './initialization/ServiceCategory.js'
import debug from './utils/logger.js'
import { httpServer, httpsServer } from './app.js'
import { initMongoose } from './mongodb/mongo.js'

dotenv.config({ path: './.env' })

const portHttp = process.env.APP_HTTP_PORT || 8081
const portHttps = process.env.APP_HTTPS_PORT || 8082

initMongoose().then(() => {
  const initializeMissingData = async () => {
    await populateServiceCategory()
  }
  try {
    initializeMissingData()
  } catch (e) {
    console.log(e)
  }

  httpServer.listen(portHttp, async () => {
    debug.log(`Http App running on port ${portHttp}...`)
  })
  httpsServer.listen(portHttps, async () => {
    debug.log(`Https App running on port ${portHttps}...`)
  })

  process.on('uncaughtException', (err) => {
    debug.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
    console.log(err)
    // debug.log(err.name, err.message);
    process.exit(1)
  })

  process.on('unhandledRejection', (err) => {
    debug.log('UNHANDLED REJECTION! 💥 Shutting down...')
    console.log(err)
    // console.log(server)
    // debug.log(err.name, err.message);
    try {
      server.close(() => {
        process.exit(1)
      })
    } catch (e) {}
  })

  process.on('SIGTERM', () => {
    debug.log('👋 SIGTERM RECEIVED. Shutting down gracefully')
    server.close(() => {
      debug.log('💥 Process terminated!')
    })
  })
})
