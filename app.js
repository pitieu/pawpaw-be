import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import session from 'express-session'
import dotenv from 'dotenv'

import authRouter from './routes/auth.js'
import storeRouter from './routes/store.js'

dotenv.config({ path: './.env' })
const __dirname = path.resolve()

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// configure Express
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
)

app.get('/', function (req, res, next) {
  res.redirect('/auth')
})

// set Routes
app.use('/auth', authRouter)
app.use('/store', storeRouter)
// app.use('/account', accountRouter);
// app.use('/services', serviceRouter);

export default app
