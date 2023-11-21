const express = require("express")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose")
const routes = require('./api/routes/routes')
const bodyParser = require("body-parser")

require("dotenv").config()

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(routes)

const port = process.env.PORT || 3100;

mongoose.connect(process.env.MONGOURI, { autoIndex: true }).then((connection) => {
	console.log('Database Connected!')
})


app.listen(port, () => {
  console.log('App Started!');
  console.log(`http://127.0.0.1:${port}/`);
});