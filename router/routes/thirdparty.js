/***
nasdaq stocks
http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NASDAQ&render=download
nyse stocks
http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NYSE&render=download
asx stocks
http://www.asx.com.au/asx/research/ASXListedCompanies.csv
***/

require('dotenv').load()

var Q           = require('q')
var _           = require('underscore')
var request     = require('request')
var User        = require('../../models/user')

String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

module.exports = function (app) {

  app.get('/third/codewar', function(req, res) {
    console.log(req.user)
    if (req.user.codeID) {
        var url = "https://www.codewars.com/api/v1/users/" + req.user.codeID + "?access_key= " + process.env.CODEWARS_API
        console.log(url)
        request(url, function(err, response, html){
            if (err) {
              return res.status(500).json({ err : err })
            }
            console.log(response)
            console.log(html)
            return res.status(200).json(response)
        })
    } else {
        return res.status(400).json({ err : "no codewars ID found" })
    }
  })

  app.get('/third/codewar/callback', function(req, res) {
      var params = req.query || req.body

      console.log('get')
      console.log('Received callback!')
      console.log(params)

      if ('username' in params) {
        //If the username is in the params, check to see if the username attributed to a user on the server
        User.findOne({
          'codeID': params.username,
        }, function(err, user) {
          if (err) {
            return res.status(500).json({ err: err })
          }
          if (user) {
            User.findOneAndUpdate(
                {'codeID': params.username},
                {$push: {codeMeta: req.body}},
                {safe: true, upsert: true},
                function(err, user) {
                    if (err) {
                        return res.status(500).json({ err: err })
                    } else {
                        return res.status(200).json({ status : 'success' })
                    }
                }
            )
          } else {
            return res.status(400).json({ err: 'No user exists with that CodeWarsID' })
          }
        })
      } else {
        return res.status(400).json({ err: 'No username in params' })
      }
    })

    app.post('/third/codewar/callback', function(req, res) {
      var params = req.query || req.body

      console.log('post')
      console.log('Received callback!')
      console.log(params)

      if ('username' in params) {
        //If the username is in the params, check to see if the username attributed to a user on the server
        User.findOne({
          'codeID': params.username,
        }, function(err, user) {
          if (err) {
            return res.status(500).json({ err: err })
          }
          if (user) {
            User.findOneAndUpdate(
                {'codeID': params.username},
                {$push: {codeMeta: req.body}},
                {safe: true, upsert: true},
                function(err, user) {
                    if (err) {
                        return res.status(500).json({ err: err })
                    } else {
                        return res.status(200).json({ status : 'success' })
                    }
                }
            )
          } else {
            return res.status(400).json({ err: 'No user exists with that CodeWarsID' })
          }
        })
      } else {
        return res.status(400).json({ err: 'No username in params' })
      }
    })
}
