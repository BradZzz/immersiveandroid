/***
nasdaq stocks
http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NASDAQ&render=download
nyse stocks
http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NYSE&render=download
asx stocks
http://www.asx.com.au/asx/research/ASXListedCompanies.csv
***/

var csv  = require('fast-csv')
var fs   = require('fs')
var Q    = require('q')
var finance = require('yahoo-finance')
var moment = require('moment')
var Chance = require('chance'), chance = new Chance();
var _ = require('underscore')

var nasdaq = fs.createReadStream("./stock_csv/nasdaq.csv")
var nyse = fs.createReadStream("./stock_csv/nyse.csv")
var asx = fs.createReadStream("./stock_csv/asx.csv")

var buyFee = 4.95

var cache = {}

module.exports = function (app) {

  app.get('/stock', function (req, res){
    console.log(req.query)
    if ('sym' in req.query) {
        var start = 'start' in req.query ? req.query.start : moment().subtract(6, 'months').format('YYYY-MM-DD')
        var end = 'end' in req.query ? req.query.end : moment().format('YYYY-MM-DD')
        // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
        var period = 'period' in req.query ? req.query.period : 'w'

        console.log(start)
        console.log(end)

        finance.historical({
          symbol: req.query.sym,
          from: start,
          to: end,
          period: period,
        }, function (err, quotes) {
          console.log(err)
          console.log(quotes)
          return res.status(200).json(quotes)
        })
    } else {
        return res.status(400).json("Bad Request")
    }
  })

  app.get('/stock/list', function(req, res) {
    if ('list' in cache) {
        return res.status(200).json(cache.list)
    } else {
        var exchangeNASDAQ = getStockStream(nasdaq, "nasdaq")
        var exchangeNYSE = getStockStream(nyse, "nyse")

        var exchanges = [exchangeNASDAQ, exchangeNYSE]

        Q.all(exchanges).then(function(gResp){
            console.log("finished")
            cache.list = gResp
            return res.status(200).json(gResp)
        }, function (err){
            console.log("error")
            console.log(err)
        })
    }
  });

  app.get('/stock/testList', function(req, res) {
      if ('testList' in cache) {
          return res.status(200).json(cache.testList)
      } else {
          var exchangeNASDAQ = getStockStream(nasdaq, "nasdaq")
          var exchangeNYSE = getStockStream(nyse, "nyse")
          var exchanges = [exchangeNASDAQ, exchangeNYSE]

          Q.all(exchanges).then(function(gResp){
              console.log("testlist")

              var list = {}
              var tickers = _.union(gResp[0].data, gResp[1].data)
              var listSize = tickers.length

              cache.testList = _.map(tickers, function(tick) {
                var maxLength = chance.integer({min: 1, max: 10})
                var comments = []
                while (comments.length < maxLength) {
                    comments.push({
                        user: chance.word({syllables: chance.integer({min: 1, max: 10})}),
                        text: chance.paragraph({sentences: chance.integer({min: 1, max: 3})})
                    })
                }
                return { ticker: tick, invested : chance.integer({min: 1, max: 250}),
                    comments : comments, buyFee : buyFee }
              })

              return res.status(200).json(list)

          }, function (err){
              console.log("error")
              console.log(err)
          })
      }
    });

  app.get('/stock/snapshot', function(req, res) {
    if ('sym' in req.query) {
      finance.snapshot({
        symbol: req.query.sym
      }, function (err, snapshot) {
        console.log(err)
        console.log(snapshot)
        return res.status(200).json(snapshot)
      })
    } else {
      return res.status(400).json("Bad Request")
    }
  });

  function getStockStream(stream, exchange){
    var deferred = Q.defer()
    var builder = { name : exchange, data : []}

    var csvStream = csv().on("data", function(data){
       if (data.length > 0 && data[0].trim().toLowerCase() != 'symbol') {
         builder.data.push(data[0].trim())
       }
    }).on("end", function(){
       console.log("done : " + exchange)
       deferred.resolve(builder)
    })

    stream.pipe(csvStream)

    return deferred.promise
  }

}
