import dotenv from 'dotenv'
import cors from 'cors'

import { populateServiceCategory } from './initialization/ServiceCategory.js'
import debug from './utils/logger.js'
import app from './app.js'
import { initMongoose } from './mongodb/mongo.js'

dotenv.config({ path: './.env' })

const port = process.env.APP_PORT || 8081

initMongoose().then(() => {
  const initializeMissingData = async () => {
    await populateServiceCategory()
  }
  try {
    initializeMissingData()
  } catch (e) {
    console.log(e)
  }
  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    }),
  )

  app.listen(port, async () => {
    debug.log(`App running on port ${port}...`)
  })

  app.use(function (err, req, res, next) {
    let message = ''
    if (err) {
      message = err.message || err.error
    } else {
      message = 'Unknown Error'
    }
    console.log(err)
    debug.error(message)
    res.status(err?.status || 500)
    if (err.error) {
      res.send(err)
    } else {
      res.send({ error: 'Woops, we encountered an error...' })
    }
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
    console.log(server)
    // debug.log(err.name, err.message);
    server.close(() => {
      process.exit(1)
    })
  })

  process.on('SIGTERM', () => {
    debug.log('👋 SIGTERM RECEIVED. Shutting down gracefully')
    server.close(() => {
      debug.log('💥 Process terminated!')
    })
  })
})
