import express from 'express'
import cookieParser from 'cookie-parser'
import http from 'http'
import https from 'https'
import path from 'path'
import session from 'express-session'
import dotenv from 'dotenv'
// import cors from 'cors'
import fs from 'fs'

// import winston from 'winston'
import expressWinston from 'express-winston'

import debug from './utils/logger.js'
import authRouter from './routes/auth.route.js'
import serviceRouter from './routes/services.route.js'
import storeRouter from './routes/store.route.js'
import orderRouter from './routes/order.route.js'
import paymentRouter from './routes/payment.route.js'
import accountRouter from './routes/account.route.js'

var privateKey = fs.readFileSync('config/sslcert/key.pem')
var certificate = fs.readFileSync('config/sslcert/cert.pem')

var credentials = { key: privateKey, cert: certificate }

expressWinston.requestWhitelist.push('body')
expressWinston.responseWhitelist.push('body')

dotenv.config({ path: './.env' })
const __dirname = path.resolve()

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// configure Express
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// app.use(
//   expressWinston.logger({
//     transports: [
//       new winston.transports.Console({
//         json: true,
//         colorize: true,
//       }),
//     ],
//   }),
// )

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
)

app.get('/', function (req, res, next) {
  res.send('ok')
})

// set Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/store', storeRouter)
// app.use('/api/v1/account', accountRouter);
app.use('/api/v1/services', serviceRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/accounts', accountRouter)

if (process.env.NODEJS_ENV === 'development') {
  app.use('/api/v1/payment', paymentRouter)
}
// log errors after routes
// app.use(
//   expressWinston.errorLogger({
//     transports: [
//       new winston.transports.Console({
//         json: true,
//         colorize: true,
//       }),
//     ],
//   }),
// )

// app.use(
//   cors({
//     credentials: true,
//     origin: 'http://localhost:3000',
//   }),
// )

app.use(function (err, req, res, next) {
  let message = ''
  if (err) {
    message = err.message || err.error
  } else {
    message = 'Unknown Error'
  }
  // debug.info(err.status)
  console.log(err)
  debug.error(message)
  res.status(err?.status || 500)
  if (err.error) {
    res.send(err)
  } else {
    res.send({ error: 'Woops, we encountered an error...', status: 500 })
  }
})

export const httpServer = http.createServer(app)
export const httpsServer = https.createServer(credentials, app)

export default app
