var mongoose = require('mongoose')

var historicLedgerSchema = new mongoose.Schema({

  symbol:     { type: String, required: true, index: true },
  user:       { type: String, required: true, index: true },
  quantity:   { type: Number, required: true },
  purchased:  { type: Date },
  created:    { type: Date, default: Date.now },
  __v:        { type: Number, select: false },

})

//methods ======================
module.exports = mongoose.model('historicLedger', historicLedgerSchema)
