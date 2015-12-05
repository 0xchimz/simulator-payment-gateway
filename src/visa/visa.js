var express = require('express')
var request = require('request')
var router = express.Router()

var bank_no = {
  524102: {
    name: 'Bank 1',
    no: '524102',
    url: '/bank1'
  },
  619230: {
    name: 'Bank 2',
    no: '619230',
    url: '/bank2'
  },
  938114: {
    name: 'Bank 3',
    no: '938114',
    url: '/bank3'
  }
}

router.post('/validate', function (req, res) {
  var fullUrl = req.protocol + '://' + req.get('host')
  var card = req.body.card
  var price = req.body.price
  var account = {
    bank_account: card.bank_account,
    check_digital: card.check_digital,
    cvv: card.cvv,
    ex_date: card.ex_date
  }
  var transaction = {
    card: account,
    price: price,
    status: 'validate'
  }
  if (bank_no[card.bank_no] !== undefined) {
    var obj = {
      uri: fullUrl + bank_no[card.bank_no].url + '/account',
      method: 'POST',
      json: transaction
    }
    request(obj, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        res.json({
          result: 'ready',
          message: 'Credit card is ready.',
          data: response.body
        })
      } else {
        res.status(500)
        res.json({
          result: 'error',
          message: response.body.message
        })
      }
    })
  } else {
    res.status(500)
    res.json({
      result: 'error',
      message: 'Cannot find the bank number in db(visa)'
    })
  }
})

router.post('/pay', function (req, res) {
  var fullUrl = req.protocol + '://' + req.get('host')
  var card = req.body.card
  var price = req.body.price
  var account = {
    bank_account: card.bank_account,
    check_digital: card.check_digital,
    cvv: card.cvv,
    ex_date: card.ex_date
  }
  var transaction = {
    card: account,
    price: price,
    status: 'pay'
  }
  if (bank_no[card.bank_no] !== undefined) {
    var obj = {
      uri: fullUrl + bank_no[card.bank_no].url + '/account',
      method: 'POST',
      json: transaction
    }
    request(obj, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        res.json({
          result: 'success',
          message: 'Transaction is success.',
          data: response.body
        })
      } else {
        res.status(500)
        res.json({
          result: 'error',
          message: response.body.message
        })
      }
    })
  } else {
    res.status(500)
    res.json({
      result: 'error',
      message: 'Cannot find the bank number in db(visa)'
    })
  }
})

module.exports = router
