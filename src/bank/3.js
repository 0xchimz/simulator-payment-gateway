var express = require('express')
var request = require('request')
var router = express.Router()

var accounts = {
  22201598: {
    no: '22201598',
    check_digital: '7',
    cvv: '778',
    card_holder: 'JOHN CONNER',
    financial_amount: 100000
  },
  88470015: {
    no: '88470015',
    check_digital: '0',
    cvv: '008',
    card_holder: 'WILLIAM HILL',
    financial_amount: 1000000
  }
}
var system_no = {
  4: {
    name: 'visa',
    url: '/visa'
  },
  5: {
    name: 'master card',
    url: '/master_card'
  }
}

router.post('/validate', function (req, res) {
  var fullUrl = req.protocol + '://' + req.get('host')
  var card = req.body.card
  var cvv = req.body.cvv
  var price = req.body.price
  var card_data = {
    bank_no: card.substring(1, 7),
    bank_account: card.substring(7, 15),
    check_digital: card.charAt(15),
    cvv: cvv
  }
  var transaction = {
    card: card_data,
    price: price
  }
  if (system_no[card.charAt(0)] !== undefined) {
    var obj = {
      uri: fullUrl + system_no[card.charAt(0)].url + '/validate',
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
        res.json({
          result: 'error',
          message: 'Credit card system reponse with error.',
          response: response.body
        })
      }
    })
  } else {
    res.json({
      result: 'error',
      message: "Can't find card system(visa, master card)",
      data: req.body
    })
  }
})

router.post('/account', function (req, res) {
  if (accounts[req.body.card.bank_account] !== undefined) {
    if (accounts[req.body.card.bank_account].check_digital === req.body.card.check_digital) {
      if (accounts[req.body.card.bank_account].cvv === req.body.card.cvv) {
        if (req.body.status === 'validate') {
          if (accounts[req.body.card.bank_account].financial_amount >= req.body.price) {
            res.json({
              result: 'ready',
              message: 'Transaction is ready'
            })
          } else {
            res.status(500)
            res.json({
              result: 'error',
              message: 'Out of amount',
              response: req.body
            })
          }
        } else if (req.body.status === 'pay') {
          if (accounts[req.body.card.bank_account].financial_amount >= req.body.price) {
            accounts[req.body.card.bank_account].financial_amount -= req.body.price
            res.json({
              result: 'ready',
              message: 'Transaction is success',
              response: req.body
            })
          } else {
            res.status(500)
            res.json({
              result: 'error',
              message: 'Out of amount',
              response: req.body
            })
          }
        }
      } else {
        res.status(500)
        res.json({
          result: 'error',
          message: "CVV doesn't match.",
          response: req.body
        })
      }
    } else {
      res.status(500)
      res.json({
        result: 'error',
        message: "Check digital doesn't match.",
        response: req.body
      })
    }
  } else {
    res.status(500)
    res.json({
      result: 'error',
      message: 'Cannot find bank account.',
      response: req.body
    })
  }
})

router.post('/payment', function (req, res) {
  var fullUrl = req.protocol + '://' + req.get('host')
  var owner = req.body.owner_card
  var card = req.body.card
  var cvv = req.body.cvv
  var price = req.body.price
  var card_data = {
    bank_no: card.substring(1, 7),
    bank_account: card.substring(7, 15),
    check_digital: card.charAt(15),
    cvv: cvv
  }
  var transaction = {
    card: card_data,
    price: price
  }
  if (system_no[card.charAt(0)] !== undefined) {
    var obj = {
      uri: fullUrl + system_no[card.charAt(0)].url + '/pay',
      method: 'POST',
      json: transaction
    }
    request(obj, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        accounts[owner].financial_amount += price
        res.json({
          result: 'success',
          message: 'Transaction success.',
          data: response.body
        })
      } else {
        res.json({
          result: 'error',
          message: 'Credit card system reponse with error.',
          response: response.body
        })
      }
    })
  } else {
    res.json({
      result: 'error',
      message: 'Cannot find card system(visa, master card)',
      data: req.body
    })
  }
})

module.exports = router
