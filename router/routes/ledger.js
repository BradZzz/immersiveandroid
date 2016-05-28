/***
nasdaq stocks
http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NASDAQ&render=download
nyse stocks
http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NYSE&render=download
asx stocks
http://www.asx.com.au/asx/research/ASXListedCompanies.csv
***/

require('dotenv').load()

var csv  = require('fast-csv')
var fs   = require('fs')
var Q    = require('q')
var moment = require('moment')
var _ = require('underscore')
var request = require('request')
var Chance = require('chance'), chance = new Chance()

var pendingLedger = require('../../models/pendingLedger')
var utils         = require('../../lib/utils')

var buyFee = 4.95

var cache = {}

module.exports = function (app) {

  app.get('/ledger/pending', function(req, res) {
    pendingLedger.find({ user : req.user._id }, function(err, pending) {
        if (err){
            return res.status(500).json(err)
        }
        return res.status(200).json(_.map(pending, function(entry){
          var nEntry = JSON.parse(JSON.stringify(entry))
          delete nEntry['_id']
          delete nEntry['token']
          delete nEntry['user']
          return nEntry
        }))
    })
  })

  app.delete('/ledger/pending', function(req, res) {
    var params = req.query || req.body
    if ('sym' in params) {
        pendingLedger.remove({ user : req.user._id, sym : params.sym }, function(err, deleted) {
          if (err){
            return res.status(500).json(err)
          }
          return res.status(200).json(deleted)
        })
    }
  })

  app.post('/ledger/pending', function(req, res) {
    var params = req.query || req.body
    if ('cost' in params && 'sym' in params && 'name' in params) {

      var pLedger = {}
      var obj = new pendingLedger()
      var id = req.user._id

      pLedger.name = params.name
      pLedger.sym = params.sym
      pLedger.cost = params.cost
      pLedger.user = id
      pLedger.token = obj.generateHash(id + process.env.TOKEN_SECRET)

      console.log('printing ledger')
      console.log(pLedger)

      pendingLedger.findOneAndUpdate({ sym : params.sym, user : req.user._id }, pLedger, { upsert : true, new : true }, function(err, ledger){
        if (err) {
          console.log(err)
          return res.status(500).json(err)
        } else {
          return res.status(200).json(ledger)
        }
      })
    } else {
      return res.status(400).json(err)
    }
  })

  app.get('/ledger/count', function(req, res) {
    pendingLedger.aggregate(
          { $match: { } },
          { $group: { _id: { 'sym' : '$sym', 'name' : '$name' }, count: {$sum: 1} } },
          { $sort: { count: -1 } }
    ).exec(function(err, stock){
        console.log(stock, err)
        if (err) {
          return res.status(500).json(err)
        }
        var ledger = {}

        _.each(stock, function(entry){
            var maxLength = chance.integer({min: 1, max: 10})
            var comments = []
            while (comments.length < maxLength) {
              comments.push({
                user: chance.word({syllables: chance.integer({min: 1, max: 10})}),
                text: chance.paragraph({sentences: chance.integer({min: 1, max: 3})})
              })
            }
            ledger[entry._id.sym] = { ticker: entry._id.sym, name: entry._id.name, invested : entry.count,
                comments : comments, buyFee : buyFee }
        })
        return res.status(200).json(ledger)
    })
  })
}
