const express = require('express')
const bodyParser = require('body-parser')
const connectDB = require('./config/db')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 3001


//Middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Connect DB

connectDB()

//Redirect HTTPS

app.use (function (req, res, next) {
    var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase()
    if (req.headers.host.indexOf('localhost') < 0 && schema !== 'https') {
        res.redirect('https://' + req.headers.host + req.url) 
    }
    next()
})

//Routes

app.use('/place', require('./routes/api/place'))
app.use('/user', require('./routes/api/user'))
app.use('/auth', require('./routes/api/auth'))

//is Alive
app.get('/', (req, res) => res.send('Hello'))

app.listen(port, () => { console.log(`APP Connected to port 3001`) })