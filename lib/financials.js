var fs        = require('fs')
var os        = require('os')
var Q         = require('q')
var csv       = require('fast-csv')
var _         = require('underscore')

var nasdaq    = fs.createReadStream("./stock_csv/nasdaq.csv")
var nyse      = fs.createReadStream("./stock_csv/nyse.csv")
var asx       = fs.createReadStream("./stock_csv/asx.csv")

module.exports = {
  updateList : function () {
    var deferred = Q.defer()
    Q.all([getStockStream(nasdaq, "nasdaq"), getStockStream(nyse, "nyse"), getStockStream(asx, "asx")]).then(function(gResp){
      console.log("finished")
      deferred.resolve(_.flatten(gResp) )
    }, function (err){
      console.log("error")
      console.log(error)
      deferred.reject(error)
    })
    return deferred.promise
  }
}

function getStockStream(stream, exchange){
    var deferred = Q.defer()
    var builder = []
    var csvStream = csv().on("data", function(data){
       if (data.length > 0 && data[0] && data[1]
         && data[0].trim().toLowerCase() != 'symbol' && data[0].trim().toLowerCase() != 'company name') {
         if (exchange === 'asx') {
            builder.push({ exchange : exchange, symbol: data[1].trim(), name: toTitleCase(data[0].trim()), industry: toTitleCase(data[2].trim()) })
         } else {
            builder.push({ exchange : exchange, symbol: data[0].trim(), name: toTitleCase(data[1].trim()), sector: toTitleCase(data[5].trim()), industry: toTitleCase(data[6].trim()) })
         }
       }
    }).on("end", function(){
       console.log("done : " + exchange)
       deferred.resolve(builder)
    })
    stream.pipe(csvStream)
    return deferred.promise
}

function toTitleCase(str)
{
    return str.replace(/\w*\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
