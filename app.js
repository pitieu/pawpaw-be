import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import session from 'express-session'
import dotenv from 'dotenv'
// import winston from 'winston'
import expressWinston from 'express-winston'

import authRouter from './routes/auth.route.js'
import serviceRouter from './routes/services.route.js'
import storeRouter from './routes/store.route.js'
import orderRouter from './routes/order.route.js'
import paymentRouter from './routes/payment.route.js'

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
app.use('/auth', authRouter)
app.use('/store', storeRouter)
// app.use('/account', accountRouter);
app.use('/services', serviceRouter)
app.use('/order', orderRouter)

if (process.env.NODEJS_ENV === 'development') {
  app.use('/payment', paymentRouter)
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

export default app
