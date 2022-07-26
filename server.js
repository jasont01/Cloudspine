require('dotenv').config()
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

const corsOptions = {
  origin: true,
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/api', require('./api/apps'))

app.use((req, res) =>
  res.status(404).sendFile(path.join(__dirname, '404.html'))
)

mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => {
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    app.listen(process.env.PORT, () =>
      console.log(`Server started on port: ${process.env.PORT}`)
    )
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
