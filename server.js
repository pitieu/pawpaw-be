import mongoose from 'mongoose'
import dotenv from 'dotenv'

import cors from 'cors'
import debug from './utils/logger.js'
import app from './app.js'

dotenv.config({ path: './.env' })

const port = process.env.APP_PORT || 8081

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  }),
)

mongoose
  .connect(process.env.DATABASE, { useUnifiedTopology: true })
  .then(() => debug.log('DB connection successful!'))

app.listen(port, () => {
  debug.log(`App running on port ${port}...`)
})

app.use(function (err, req, res, next) {
  let message = ''
  if (err) {
    message = err.message || err.error
  } else {
    message = 'Unknown Error'
  }
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
