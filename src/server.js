var express = require('express')
var bodyParser = require('body-parser')

var app = express()

var bank1 = require('./bank/1')
var bank2 = require('./bank/2')
var bank3 = require('./bank/3')
var visa = require('./visa/visa')
var master_card = require('./master_card/master_card')

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.use('/bank1', bank1)

app.use('/bank2', bank2)

app.use('/bank3', bank3)

app.use('/visa', visa)

app.use('/master_card', master_card)

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('[App listening at http://%s:%s]', host, port)
})
