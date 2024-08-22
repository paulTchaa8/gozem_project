const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

const deliveryRoutes = require('./routes/delivery')
const packageRoutes = require('./routes/package')

const app = express()

// connexion mongoDB..
// MONGO_URL='mongodb://localhost:27017/gozem'
MONGO_URL='mongodb+srv://franky:franky@cluster0.jarxe.mongodb.net/gozem?retryWrites=true&w=majority'

mongoose.connect(MONGO_URL)
    .then(() => console.log('Connexion OK'))
    .catch(() => console.log('Connexion echouee'))

// gerer les erreurs Cross Origin..
app.use(cors())

app.use(bodyParser.json())

// Ici les routes..
app.use('/api/delivery', deliveryRoutes)
app.use('/api/package', packageRoutes)

module.exports = app;