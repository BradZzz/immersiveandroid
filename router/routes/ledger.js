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

var pendingLedger = require('../../models/pendingLedger')

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
      var pLedger = new pendingLedger();
      var id = req.user._id

      pLedger.name = params.name
      pLedger.sym = params.sym
      pLedger.cost = params.cost
      pLedger.user = id
      pLedger.token = pLedger.generateHash(id + process.env.TOKEN_SECRET)

      pLedger.save(function (err, ledger) {
        if (err) {
          return res.status(500).json(err)
        }
        return res.status(200).json(ledger)
      })
    } else {
      return res.status(400).json(err)
    }
  })

}
