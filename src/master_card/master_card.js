var express = require('express')
var request = require('request')
var router = express.Router()

var bank_no = {
  624890: {
    name: 'Bank 1',
    no: '624890',
    url: '/bank1'
  },
  301525: {
    name: 'Bank 2',
    no: '301525',
    url: '/bank2'
  },
  415763: {
    name: 'Bank 3',
    no: '415763',
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
    exp_date: card.exp_date
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
    exp_date: card.exp_date
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
